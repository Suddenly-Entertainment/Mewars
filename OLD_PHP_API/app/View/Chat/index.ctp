<?php
echo $this->Html->css('content');
echo $this->Html->script('jQuery');
echo $this->Html->script('http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js');
?>
<table>
<tbody>
	<tr>
		<td id="content_main">
			<div class="windowbg">
				<h3 class="catbg">LightIRC Chat Client</h3>
				<table>
				<tbody>
					<tr>
						<td>
							<div id="lightIRC" style="height:100%; text-align:center;">
								<p><a href="http://www.adobe.com/go/getflashplayer"><img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" /></a></p>
							</div>
						</td>
					</tr>
				</tbody>
				</table>
			</div>
			<script type="text/javascript">
				/*
				 * lightIRC configuration
				 * www.lightIRC.com
				 *
				 * You can add or change these parameters to customize lightIRC.
				 * Please see the full parameters list at http://redmine.lightirc.com/projects/lightirc/wiki/Customization_parameters
				 *
				 */

				var params = {};
				<?php
				global $context;
				$MEW_URL = "mewdev.decisive-media.net";
				if ($context['user']['is_guest']) {
					echo 'params.nick = "Pony_%";';
					echo 'params.showNickSelection = true;';
				} else {
					echo 'params.nick = "' . $context['user']['name'] . '";';
					echo 'params.nickAlternate = "' . $context['user']['name'] . '_";';
					echo 'params.showNickSelection = false;';
				}?>

				/* Change these parameters */
				params.host                         = "irc.canternet.org";
				params.port                         = 6667;
				params.policyPort                   = 843;

				/* Language for the user interface. Currently available translations: bd, bg, br, cz, da, de, el, en, es, et, fi, fr, hu, hr, id, it, ja, nl, pl, pt, ro, ru, sl, sq, sr_cyr, sr_lat, sv, th, tr, uk */
				params.language                     = "en";

				/* Relative or absolute URL to a lightIRC CSS file.
				 * The use of styles only works when you upload lightIRC to your webspace.
				 * Example: css/lightblue.css 
				 */
				params.styleURL                     = "";

				/* Channel to be joined after connecting. Multiple channels can be added like this: #lightIRC,#test,#help */
				params.autojoin                     = "#MockEquestrianWars";
				/* Commands to be executed after connecting. E.g.: /mode %nick% +x */
				params.perform                      = "";

				/* Whether the server window (and button) should be shown */
				params.showServerWindow             = true;
				
				/* Adds a password field to the nick selection box */
				params.showIdentifySelection        = false;

				/* Show button to register a nickname */
				params.showRegisterNicknameButton   = true;
				/* Show button to register a channel */
				params.showRegisterChannelButton    = false;

				/* Opens new queries in background when set to true */
				params.showNewQueriesInBackground   = false;

				/* Position of the navigation container (where channel and query buttons appear). Valid values: left, right, top, bottom */
				params.navigationPosition           = "bottom";
				
				params.emoticonPath =  <?php echo '"' . $MEW_URL . '/lightIRC/emoticons/"'; ?>;


				/* See more parameters at http://redmine.lightirc.com/projects/lightirc/wiki/Customization_parameters */

				/* Use this method to send a command to lightIRC with JavaScript */
				function sendCommand(command) {
				  swfobject.getObjectById('lightIRC').sendCommand(command);
				}

				/* This method gets called if you click on a nick in the chat area */
				function onChatAreaClick(nick) {
				  //alert("onChatAreaClick: "+nick);
				}

				/* This method gets called if you use the parameter contextMenuExternalEvent */
				function onContextMenuSelect(type, nick) {
				  alert("onContextMenuSelect: "+nick+" for type "+type);
				}

				/* This method gets called if you use the parameter loopServerCommands */
				function onServerCommand(command) {
				  return command;
				}

				/* This loop escapes % signs in parameters. You should not change it */
				for(var key in params) {
				  params[key] = params[key].toString().replace(/%/g, "%25");
				}
				<?php echo 'swfobject.embedSWF("' . $MEW_URL . '/lightIRC/lightIRC.swf", "lightIRC", "100%", "500px", "10.0.0", "' . $MEWARS_URL . '/lightIRC/expressInstall.swf", params);'; ?>
			</script>
		</td>
		<td id="content_side">
			<?php echo $this->element('online'); ?>
		</td>
	</tr>
</tbody>
</table>