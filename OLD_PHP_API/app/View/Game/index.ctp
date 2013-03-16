<?php
echo $this->Html->css('content');
echo $this->Html->css('game');
echo $this->Html->script('JQuery');
?>
<table>
<tbody>
	<tr>
		
		<td id="content_main">
			<h3 class="catbg">Mock Equestrian Wars Game Client</h3>
			<div id="GameDiv" class="windowbg" align="center">
			    <div id ="cr-stage" >
    				<canvas id="MEWGame" width="800" height="600">
    				<p style="text-align:center;">
    				Your Browser doen't suport the HTML 5 Canvas tag? what kind of stone age browser are you useing! Upgrade to Firefox Chrome or Opera!
    				<br/>
    				<a href="https://affiliates.mozilla.org/link/banner/12001/3/1"><img src="/img/firefox.jpg" width="50" height="50" /></a>
    				<a href="https://www.google.com/chrome"><img src="/img/chrome.jpg" width="50" height="50" /></a>
    				<a href="http://www.opera.com/"><img src="/img/opera.jpg" width="50" height="50" /></a>
    				</p>
    				</canvas>
				</div>
			</div>
			<div id="CodeDiv">
				<script src="/code/load"></script>
			</div>
		</td>
		<td id="content_side">
			<?php echo $this->element('online'); ?>
		</td>
	</tr>
</tbody>
</table>