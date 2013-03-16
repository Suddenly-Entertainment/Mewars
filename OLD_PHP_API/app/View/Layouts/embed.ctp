<head>
	<title>
		<?php echo $title_for_layout; ?>
	</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
	<?php echo $content_for_layout; 
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