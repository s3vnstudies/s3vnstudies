<?php include("../Includes/Start.php"); ?>
<html>
	<head>
		<title> Chicago Stamp Collecting Club | Index of All Articles in the  Chicago Stamp Collecting Club Category</title>
		<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
		<meta name="Creator" content="Niche Mania - http://www.niche-maniacs.com">
		<meta name="Copyright" content="<?=$CopyRight;?>">
		<meta name="Description" content="Index of All Articles in the  Chicago Stamp Collecting Club Category">
		<meta name="Keywords" content="<?=$Keywords;?>">
		<meta name="Distribution" content="global">
		<meta name="Publisher" content="<?=$Domain;?>">
		<meta name="Rating" content="General">
		<meta name="Revisit-after" content="5 days">
		<meta name="Robots" content="index,follow">
		<link href="../Includes/Styles.css" rel="stylesheet" type="text/css">
			<script src="../Includes/JavaScript.js"></script>
	</head>
	<body>
		<table align="center" cellpadding="0" cellspacing="0" class="tblMain">
			<tr>
				<td class="tdHeader" colspan="2">
					<h1>
						<?=$MainTitle;?>
					</h1>
					<h3>
						<?=$SubTitle;?>
					</h3>
				</td>
			</tr>
			<tr>
				<td class="tdRow" colspan="2">
					<?php $Menu = "Articles"; include("../Includes/Menu.php"); ?>
				</td>
			</tr>
			<tr>
				<td class="tdLeft">
					<?php include("../Includes/J_Box.php"); ?> <?php 
					include("../Includes/Navigation.php"); ?> <?php 
					include("../Includes/Google_160x600.php"); ?>
				</td>
				<td class="tdContent">
					<br>
					<p>
						<b>Index of All Articles in the  Chicago Stamp Collecting Club Category</b> 
					</p>
					<?php include("../Includes/Google_336x280.php"); ?>
					<p>
						<br>
<br>
<b>
<a href='../Articles/Why_Not_Join_a_Chicago_Stamp_Collecting_Club.php'>Why Not Join a Chicago Stamp Collecting Club?</a>
</b>
<br>
<br>
People from all walks of life will always find some profitable if not gratifying hobby to engaged with This is according to the study in the U S conducted to some 100 people who were interviewed according to the kind of hobbies they are currently engaged w<br>
<small>
<a href='../Articles/Why_Not_Join_a_Chicago_Stamp_Collecting_Club.php'>Read More...</a>
</small>
<br>
<br>
 
					</p>
					<br>
				</td>
			</tr>
			<?php if($ShowNewsFeed) { ?>
			<tr>
				<td class="tdRow" colspan="2">
					<?=$Category;?> News and Events
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<?php include("../Includes/Google_Search.php"); ?>
				</td>
			</tr>
			<tr>
				<td colspan="2">
					<br>
					<?php include("../Includes/NewsFeed.php"); ?> <?php if ($DisplayAmazon) { echo 
					"<hr>"; echo "<br><center>"; include("../Includes/Amazon_728x90.php"); echo 
					"</center><br>"; } ?>
				</td>
			</tr>
			<?php } ?>
			<tr>
				<td class="tdRow" colspan="2">
					&copy; <?=date("Y");?>, <a href="<?=$Domain;?>"><?=$SiteName;?></a> - All 
					Rights Reserved Worldwide | <a href="../Legal/index.php"><?=$Category;?> Legal 
						Information</a>
				</td>
			</tr>
		</table>
		<?php include("../Includes/Footer.php"); ?> <?php 
		include("../Includes/AdTracker.php"); ?>
	</body>
</html>
