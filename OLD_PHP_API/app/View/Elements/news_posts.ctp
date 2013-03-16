<?php

echo $this->Html->css('news');

// Show the latest news, with a template... by board.
function mewars_getnews($board = null, $limit = null, $start = null, $length = null, $output_method = 'echo')
{
	global $scripturl, $db_prefix, $txt, $settings, $modSettings, $context, $memberContext;
	global $smcFunc, $user_info;

	loadLanguage('Stats');

	// Must be integers....
	if ($limit === null)
		$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 5;
	else
		$limit = (int) $limit;

	if ($start === null)
		$start = isset($_GET['start']) ? (int) $_GET['start'] : 0;
	else
		$start = (int) $start;

	if ($board !== null)
		$board = (int) $board;
	elseif (isset($_GET['board']))
		$board = (int) $_GET['board'];

	if ($length === null)
		$length = isset($_GET['length']) ? (int) $_GET['length'] : 0;
	else
		$length = (int) $length;

	$limit = max(0, $limit);
	$start = max(0, $start);

	// Make sure guests can see this board.
	$request = $smcFunc['db_query']('', '
		SELECT id_board
		FROM {db_prefix}boards
		WHERE ' . ($board === null ? '' : 'id_board = {int:current_board}
			AND ') . 'FIND_IN_SET(-1, member_groups)
		LIMIT 1',
		array(
			'current_board' => $board,
		)
	);
	if ($smcFunc['db_num_rows']($request) == 0)
	{
		if ($output_method == 'echo')
			die($txt['ssi_no_guests']);
		else
			return array();
	}
	list ($board) = $smcFunc['db_fetch_row']($request);
	$smcFunc['db_free_result']($request);

	// Load the message icons - the usual suspects.
	$stable_icons = array('xx', 'thumbup', 'thumbdown', 'exclamation', 'question', 'lamp', 'smiley', 'angry', 'cheesy', 'grin', 'sad', 'wink', 'moved', 'recycled', 'wireless');
	$icon_sources = array();
	foreach ($stable_icons as $icon)
		$icon_sources[$icon] = 'images_url';

	// Find the post ids.
	$request = $smcFunc['db_query']('', '
		SELECT id_first_msg
		FROM {db_prefix}topics
		WHERE id_board = {int:current_board}' . ($modSettings['postmod_active'] ? '
			AND approved = {int:is_approved}' : '') . '
		ORDER BY id_first_msg DESC
		LIMIT ' . $start . ', ' . $limit,
		array(
			'current_board' => $board,
			'is_approved' => 1,
		)
	);
	$posts = array();
	while ($row = $smcFunc['db_fetch_assoc']($request))
		$posts[] = $row['id_first_msg'];
	$smcFunc['db_free_result']($request);

	if (empty($posts))
		return array();

	// Find the posts.
	$request = $smcFunc['db_query']('', '
		SELECT
			m.icon, m.subject, m.body, IFNULL(mem.real_name, m.poster_name) AS poster_name, m.poster_time,
			t.num_replies, t.id_topic, m.id_member, m.smileys_enabled, m.id_msg, t.locked, t.id_last_msg
		FROM {db_prefix}topics AS t
			INNER JOIN {db_prefix}messages AS m ON (m.id_msg = t.id_first_msg)
			LEFT JOIN {db_prefix}members AS mem ON (mem.id_member = m.id_member)
		WHERE t.id_first_msg IN ({array_int:post_list})
		ORDER BY t.id_first_msg DESC
		LIMIT ' . count($posts),
		array(
			'post_list' => $posts,
		)
	);
	$return = array();
	$all_posters = array();
	while ($row = $smcFunc['db_fetch_assoc']($request))
	{
		// If we want to limit the length of the post.
		if (!empty($length) && $smcFunc['strlen']($row['body']) > $length)
		{
			$row['body'] = $smcFunc['substr']($row['body'], 0, $length);

			// The first space or line break. (<br />, etc.)
			$cutoff = max(strrpos($row['body'], ' '), strrpos($row['body'], '<'));

			if ($cutoff !== false)
				$row['body'] = $smcFunc['substr']($row['body'], 0, $cutoff);
			$row['body'] .= '...';
		}

		$row['body'] = parse_bbc($row['body'], $row['smileys_enabled'], $row['id_msg']);

		// Check that this message icon is there...
		if (empty($modSettings['messageIconChecks_disable']) && !isset($icon_sources[$row['icon']]))
			$icon_sources[$row['icon']] = file_exists($settings['theme_dir'] . '/images/post/' . $row['icon'] . '.gif') ? 'images_url' : 'default_images_url';

		censorText($row['subject']);
		censorText($row['body']);
		
		if (!empty($row['id_member']))
			$all_posters[$row['id_msg']] = $row['id_member'];

		$return[] = array(
			'id' => $row['id_topic'],
			'message_id' => $row['id_msg'],
			'icon' => '<img src="' . $settings[$icon_sources[$row['icon']]] . '/post/' . $row['icon'] . '.gif" alt="' . $row['icon'] . '" />',
			'subject' => $row['subject'],
			'time' => timeformat($row['poster_time']),
			'timestamp' => forum_time(true, $row['poster_time']),
			'body' => $row['body'],
			'href' => $scripturl . '?topic=' . $row['id_topic'] . '.0',
			'link' => '<a href="' . $scripturl . '?topic=' . $row['id_topic'] . '.0">' . $row['num_replies'] . ' ' . ($row['num_replies'] == 1 ? $txt['ssi_comment'] : $txt['ssi_comments']) . '</a>',
			'replies' => $row['num_replies'],
			'comment_href' => !empty($row['locked']) ? '' : $scripturl . '?action=post;topic=' . $row['id_topic'] . '.' . $row['num_replies'] . ';last_msg=' . $row['id_last_msg'],
			'comment_link' => !empty($row['locked']) ? '' : '<a href="' . $scripturl . '?action=post;topic=' . $row['id_topic'] . '.' . $row['num_replies'] . ';last_msg=' . $row['id_last_msg'] . '">' . $txt['ssi_write_comment'] . '</a>',
			'new_comment' => !empty($row['locked']) ? '' : '<a href="' . $scripturl . '?action=post;topic=' . $row['id_topic'] . '.' . $row['num_replies'] . '">' . $txt['ssi_write_comment'] . '</a>',
			'poster' => array(
				'id' => $row['id_member'],
				'name' => $row['poster_name'],
				'href' => !empty($row['id_member']) ? $scripturl . '?action=profile;u=' . $row['id_member'] : '',
				'link' => !empty($row['id_member']) ? '<a href="' . $scripturl . '?action=profile;u=' . $row['id_member'] . '">' . $row['poster_name'] . '</a>' : $row['poster_name']
			),
			'locked' => !empty($row['locked']),
			'is_last' => false
		);
	}
	$smcFunc['db_free_result']($request);
	
	$posters = array_unique($all_posters);
	loadMemberData($posters);

	if (empty($return))
		return $return;

	$return[count($return) - 1]['is_last'] = true;

	if ($output_method != 'echo')
		return $return;

	echo '
		<table>
			<tbody>';
	foreach ($return as $news)
	{
		// If it couldn't load, or the user was a guest.... someday may be done with a guest table.
		if (!loadMemberContext($news['poster']['id'], true))
		{
			// Notice this information isn't used anywhere else....
			$memberContext[$news['poster']['id']]['name'] = $news['poster']['name'];
			$memberContext[$news['poster']['id']]['id'] = 0;
			$memberContext[$news['poster']['id']]['group'] = $txt['guest_title'];
			$memberContext[$news['poster']['id']]['link'] = $news['poster']['name'];
			$memberContext[$news['poster']['id']]['email'] = "";
			$memberContext[$news['poster']['id']]['show_email'] = showEmailAddress(true, 0);
			$memberContext[$news['poster']['id']]['is_guest'] = true;
		}
		else
		{
			$memberContext[$news['poster']['id']]['can_view_profile'] = allowedTo('profile_view_any') || ($news['poster']['id'] == $user_info['id'] && allowedTo('profile_view_own'));
			$memberContext[$news['poster']['id']]['is_topic_starter'] = $news['poster']['id'] == $context['topic_starter_id'];
			$memberContext[$news['poster']['id']]['can_see_warning'] = !isset($context['disabled_fields']['warning_status']) && $memberContext[$news['poster']['id']]['warning_status'] && ($context['user']['can_mod'] || (!$user_info['is_guest'] && !empty($modSettings['warning_show']) && ($modSettings['warning_show'] > 1 || $news['poster']['id'] == $user_info['id'])));
		}
		echo '
			<tr><td>
			<div class="windowbg">
				<h4 class="catbg">
					', $news['icon'], '
					<a href="', $news['href'], '">', $news['subject'], '</a>
				</h4>
				<div class="post_wrapper" style="float: left; width: 100%;">
				<div id="post">';
				
				
		// Show information about the poster of this message.
		echo '
						<div class="poster">
							<h4>';
		$poster = &$memberContext[$news['poster']['id']];
		// Show online and offline buttons?
		if (!empty($modSettings['onlineEnable']) && !$poster['is_guest'])
			echo '
								', $context['can_send_pm'] ? '<a href="' . $poster['online']['href'] . '" title="' . $poster['online']['label'] . '">' : '', '<img src="', $poster['online']['image_href'], '" alt="', $poster['online']['text'], '" />', $context['can_send_pm'] ? '</a>' : '';

		// Show a link to the member's profile.
		echo '
								', $poster['link'], '
							</h4>
							<ul class="reset smalltext" id="msg_', $message['id'], '_extra_info">';

		// Show the member's custom title, if they have one.
		if (!empty($poster['title']))
			echo '
								<li class="title">', $poster['title'], '</li>';

		// Show the member's primary group (like 'Administrator') if they have one.
		if (!empty($poster['group']))
			echo '
								<li class="membergroup">', $poster['group'], '</li>';

		// Don't show these things for guests.
		if (!$poster['is_guest'])
		{
			// Show the post group if and only if they have no other group or the option is on, and they are in a post group.
			if ((empty($settings['hide_post_group']) || $poster['group'] == '') && $poster['post_group'] != '')
				echo '
								<li class="postgroup">', $poster['post_group'], '</li>';
			echo '
								<li class="stars">', $poster['group_stars'], '</li>';

			// Show avatars, images, etc.?
			if (!empty($settings['show_user_images']) && empty($options['show_no_avatars']) && !empty($poster['avatar']['image']))
				echo '
								<li class="avatar">
									<a href="', $scripturl, '?action=profile;u=', $poster['id'], '">
										', $poster['avatar']['image'], '
									</a>
								</li>';

			// Show how many posts they have made.
			if (!isset($context['disabled_fields']['posts']))
				echo '
								<li class="postcount">', $txt['member_postcount'], ': ', $poster['posts'], '</li>';

			// Is karma display enabled?  Total or +/-?
			if ($modSettings['karmaMode'] == '1')
				echo '
								<li class="karma">', $modSettings['karmaLabel'], ' ', $poster['karma']['good'] - $poster['karma']['bad'], '</li>';
			elseif ($modSettings['karmaMode'] == '2')
				echo '
								<li class="karma">', $modSettings['karmaLabel'], ' +', $poster['karma']['good'], '/-', $poster['karma']['bad'], '</li>';

			// Is this user allowed to modify this member's karma?
			if ($poster['karma']['allow'])
				echo '
								<li class="karma_allow">
									<a href="', $scripturl, '?action=modifykarma;sa=applaud;uid=', $poster['id'], ';topic=', $context['current_topic'], '.' . $context['start'], ';m=', $message['id'], ';', $context['session_var'], '=', $context['session_id'], '">', $modSettings['karmaApplaudLabel'], '</a>
									<a href="', $scripturl, '?action=modifykarma;sa=smite;uid=', $poster['id'], ';topic=', $context['current_topic'], '.', $context['start'], ';m=', $message['id'], ';', $context['session_var'], '=', $context['session_id'], '">', $modSettings['karmaSmiteLabel'], '</a>
								</li>';

			// Show the member's gender icon?
			if (!empty($settings['show_gender']) && $poster['gender']['image'] != '' && !isset($context['disabled_fields']['gender']))
				echo '
								<li class="gender">', $txt['gender'], ': ', $poster['gender']['image'], '</li>';

			// Show their personal text?
			if (!empty($settings['show_blurb']) && $poster['blurb'] != '')
				echo '
								<li class="blurb">', $poster['blurb'], '</li>';

			// Any custom fields to show as icons?
			if (!empty($poster['custom_fields']))
			{
				$shown = false;
				foreach ($poster['custom_fields'] as $custom)
				{
					if ($custom['placement'] != 1 || empty($custom['value']))
						continue;
					if (empty($shown))
					{
						$shown = true;
						echo '
								<li class="im_icons">
									<ul>';
					}
					echo '
										<li>', $custom['value'], '</li>';
				}
				if ($shown)
					echo '
									</ul>
								</li>';
			}

			// This shows the popular messaging icons.
			if ($poster['has_messenger'] && $poster['can_view_profile'])
				echo '
								<li class="im_icons">
									<ul>
										', !empty($poster['icq']['link']) ? '<li>' . $poster['icq']['link'] . '</li>' : '', '
										', !empty($poster['msn']['link']) ? '<li>' . $poster['msn']['link'] . '</li>' : '', '
										', !empty($poster['aim']['link']) ? '<li>' . $poster['aim']['link'] . '</li>' : '', '
										', !empty($poster['yim']['link']) ? '<li>' . $poster['yim']['link'] . '</li>' : '', '
									</ul>
								</li>';

			// Show the profile, website, email address, and personal message buttons.
			if ($settings['show_profile_buttons'])
			{
				echo '
								<li class="profile">
									<ul>';
				// Don't show the profile button if you're not allowed to view the profile.
				if ($poster['can_view_profile'])
					echo '
										<li><a href="', $poster['href'], '">', ($settings['use_image_buttons'] ? '<img src="' . $settings['images_url'] . '/icons/profile_sm.gif" alt="' . $txt['view_profile'] . '" title="' . $txt['view_profile'] . '" />' : $txt['view_profile']), '</a></li>';

				// Don't show an icon if they haven't specified a website.
				if ($poster['website']['url'] != '' && !isset($context['disabled_fields']['website']))
					echo '
										<li><a href="', $poster['website']['url'], '" title="' . $poster['website']['title'] . '" target="_blank" class="new_win">', ($settings['use_image_buttons'] ? '<img src="' . $settings['images_url'] . '/www_sm.gif" alt="' . $poster['website']['title'] . '" />' : $txt['www']), '</a></li>';

				// Don't show the email address if they want it hidden.
				if (in_array($poster['show_email'], array('yes', 'yes_permission_override', 'no_through_forum')))
					echo '
										<li><a href="', $scripturl, '?action=emailuser;sa=email;msg=', $message['id'], '" rel="nofollow">', ($settings['use_image_buttons'] ? '<img src="' . $settings['images_url'] . '/email_sm.gif" alt="' . $txt['email'] . '" title="' . $txt['email'] . '" />' : $txt['email']), '</a></li>';

				// Since we know this person isn't a guest, you *can* message them.
				if ($context['can_send_pm'])
					echo '
										<li><a href="', $scripturl, '?action=pm;sa=send;u=', $poster['id'], '" title="', $poster['online']['is_online'] ? $txt['pm_online'] : $txt['pm_offline'], '">', $settings['use_image_buttons'] ? '<img src="' . $settings['images_url'] . '/im_' . ($poster['online']['is_online'] ? 'on' : 'off') . '.gif" alt="' . ($poster['online']['is_online'] ? $txt['pm_online'] : $txt['pm_offline']) . '" />' : ($poster['online']['is_online'] ? $txt['pm_online'] : $txt['pm_offline']), '</a></li>';

				echo '
									</ul>
								</li>';
			}

			// Any custom fields for standard placement?
			if (!empty($poster['custom_fields']))
			{
				foreach ($poster['custom_fields'] as $custom)
					if (empty($custom['placement']) || empty($custom['value']))
						echo '
								<li class="custom">', $custom['title'], ': ', $custom['value'], '</li>';
			}

			// Are we showing the warning status?
			if ($poster['can_see_warning'])
				echo '
								<li class="warning">', $context['can_issue_warning'] ? '<a href="' . $scripturl . '?action=profile;area=issuewarning;u=' . $poster['id'] . '">' : '', '<img src="', $settings['images_url'], '/warning_', $poster['warning_status'], '.gif" alt="', $txt['user_warn_' . $poster['warning_status']], '" />', $context['can_issue_warning'] ? '</a>' : '', '<span class="warn_', $poster['warning_status'], '">', $txt['warn_' . $poster['warning_status']], '</span></li>';
		}
		// Otherwise, show the guest's email.
		elseif (!empty($poster['email']) && in_array($poster['show_email'], array('yes', 'yes_permission_override', 'no_through_forum')))
			echo '
								<li class="email"><a href="', $scripturl, '?action=emailuser;sa=email;msg=', $message['id'], '" rel="nofollow">', ($settings['use_image_buttons'] ? '<img src="' . $settings['images_url'] . '/email_sm.gif" alt="' . $txt['email'] . '" title="' . $txt['email'] . '" />' : $txt['email']), '</a></li>';

		// Done with the information about the poster... on to the post itself.
		echo '
							</ul>
						</div>
					<div class="postarea">
						<div class="news_timestamp"> &#171; <strong> on: </strong>', $news['time'], ' &#187;</div>
						<div class="news_body inner" style="padding: 2ex 2ex;">', $news['body'], '</div>
				</div>
				</div>
						
				</div>
				<span style="display: block; padding-left: 20px; float: right; margin-bottom: 0.2em; text-align: right;">	
				', $news['link'], $news['locked'] ? '' : ' | ' . $news['comment_link'], ' 
				</span>
				</div>
				</td></tr>';

	}
	echo '
			</tbody>
		</table>';
}
?>
<h3 class="catbg"> Latest News </h3>
<div id="newsposts">
<?php mewars_getnews(); //$board, $limit, $start, $length ?>
</div>