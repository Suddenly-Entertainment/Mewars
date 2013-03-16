<?php echo $this->Html->css('content'); ?>
<div id="content_news"><?php echo $this->element('news_strip'); ?></div>
<table>
<tbody>
	<tr>
		<td id="content_main">
			<?php echo $this->element('news_posts'); ?>
		</td>
		<td id="content_side">
			<?php echo $this->element('online'); ?>
		</td>
	</tr>
</tbody>
</table>

