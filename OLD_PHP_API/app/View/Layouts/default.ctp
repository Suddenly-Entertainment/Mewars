<?php
/**
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright 2005-2011, Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright 2005-2011, Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       Cake.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       MIT License (http://www.opensource.org/licenses/mit-license.php)
 */

$titleDescription = "Mock Equestrian Wars: Throw the Cake, and eat it too!";
$MEW_DEBUG = false;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $titleDescription; ?>:
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		global $MEW_URL;
		echo $this->Html->meta($MEW_URL . '/favicon.ico', $MEW_URL . '/favicon.ico', array('type' => 'icon'));
		echo $this->Html->css('cake.generic');

		echo $scripts_for_layout;
	?>
</head>
<body>
	<div id="container">
		<div id="content">

			<?php echo $this->Session->flash(); ?>

			<?php echo $content_for_layout; ?>

		</div>
	</div>
	<?php if($MEW_DEBUG){
		echo "<h4>SQL Dump (for debuging)</h4>";
		echo $this->element('sql_dump');
	} 
	/*****************
	** httpBL START **
	*****************/
	global $sourcedir, $modSettings;
	if ($modSettings['httpBL_enable'])
	{
		require_once($sourcedir . '/httpBL_Subs.php');
		$honeyLink = httpBL_honeylink($modSettings['httpBL_honeyPot_link'], $modSettings['httpBL_honeyPot_word']);
		echo $honeyLink;
	}
	/*****************
	**  httpBL END  **
	*****************/
	?>
</body>
</html>