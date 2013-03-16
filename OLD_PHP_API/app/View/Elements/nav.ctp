<?php
global $context, $MEW_AREA;
if (!isset($MEW_AREA)) $MEW_AREA = 'home';
$context['menu_buttons'][$MEW_AREA]['active_button'] = true;
$context['menu_buttons']['forum']['active_button'] = false;
// CSS 
echo $this->Html->css('nav');
echo $this->Html->css('dropmenu');
// Nav bar
echo '<div id="nav">'; 
	ssi_menubar();
echo '</div>';
?>