<?php
	echo $this->Html->css('header');

	function user_welcome($output_method = 'echo')
	{
		global $context, $txt, $scripturl;

		if ($output_method == 'echo')
		{
			if ($context['user']['is_guest']){
				echo sprintf($txt['welcome_guest'], $txt['guest_title']);
			} else {
				if (!empty($context['user']['avatar'])){
					echo '<div id="avatar">', $context['user']['avatar']['image'], '</div>';
				}
				echo $txt['hello_member'], ' <strong>', $context['user']['name'], '</strong>', allowedTo('pm_read') ? ', ' . $txt['msg_alert_you_have'] . ' <a href="' . $scripturl . '?action=pm">' . $context['user']['messages'] . ' ' . ($context['user']['messages'] == '1' ? $txt['message_lowercase'] : $txt['msg_alert_messages']) . '</a>' . $txt['newmessages4'] . ' ' . $context['user']['unread_messages'] . ' ' . ($context['user']['unread_messages'] == '1' ? $txt['newmessages0'] : $txt['newmessages1']) : '', '.';
			}
		}
		// Don't echo... then do what?!
		else
			return $context['user'];
	}
	
	function user_login($redirect_to = '', $output_method = 'echo')
	{
		global $scripturl, $txt, $user_info, $context, $modSettings;

		if ($redirect_to != '')
			$_SESSION['login_url'] = $redirect_to;

		if ($output_method != 'echo' || !$user_info['is_guest'])
			return $user_info['is_guest'];

		echo '
			<form id="guest_form" action="', $scripturl, '?action=login2" method="post" accept-charset="', $context['character_set'], '">
				<input type="text" id="user" name="user" size="9" value="', $user_info['username'], '" class="input_text" />
				<input type="password" name="passwrd" id="passwrd" size="9" class="input_password" />
				<select name="cookielength">
					<option value="60">1 Hour</option>
					<option value="1440">1 Day</option>
					<option value="10080">1 Week</option>
					<option value="43200">1 Month</option>
					<option value="-1" selected="selected">Forever</option>
				</select>
				<br />
				<div class="info">Login with username, password and session length</div>';
		// Open ID?
		if (!empty($modSettings['enableOpenID']))
			echo '<input type="text" name="openid_identifier" id="openid_url" class="input_text openid_login" size="25" class="input_text openid_login"/>';

		echo '	<br />
				<input type="submit" value="', $txt['login'], '" class="button_submit" />
			</form>';

	}
?>
<div id="header">
	<div id="userwelcome">
	<div class="info"><?php user_welcome();?></div>
	<?php 
		global $MEW_URL;
		user_login($MEW_URL);		
	?>
	</div>
	<div id="logo">
	<?php echo $this->Html->link($this->Html->image('logo.png', array('alt' => 'Mock-Equestrian-Wars', 'height' => '200')), '/', array('escape' => false)); ?>
	</div>
</div>