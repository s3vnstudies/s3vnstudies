<?php include("../Includes/Start.php"); ?>
<html>
	<head>
		<title> Coin And Stamp Collector | Index of All Articles in the  Coin And Stamp Collector Category</title>
		<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
		<meta name="Creator" content="Niche Mania - http://www.niche-maniacs.com">
		<meta name="Copyright" content="<?=$CopyRight;?>">
		<meta name="Description" content="Index of All Articles in the  Coin And Stamp Collector Category">
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
						<b>Index of All Articles in the  Coin And Stamp Collector Category</b> 
					</p>
					<?php include("../Includes/Google_336x280.php"); ?>
					<p>
						<br>
<br>
<b>
<a href='../Articles/Coins_and_Stamps_A_Favorite_for_Collectors.php'>Coins and Stamps: A Favorite for Collectors</a>
</b>
<br>
<br>
People have different hobbies because people have different interests There are people interested in sports, in arts, in crafts or even in games What matters in choosing a hobby is that it keeps you interested It makes idle time worthwhile It tells a lot a<br>
<small>
<a href='../Articles/Coins_and_Stamps_A_Favorite_for_Collectors.php'>Read More...</a>
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
