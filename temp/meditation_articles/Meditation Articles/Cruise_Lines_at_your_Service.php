<?php include("../Includes/Start.php"); ?>
<html>
	<head>
		<title> Cruise Line | Cruise Lines at your Service</title>
		<meta http-equiv="Content-Type"	content="text/html; charset=windows-1252">
		<meta name="Creator"			content="Niche Mania - http://www.niche-maniacs.com">
		<meta name="Copyright"			content="<?=$CopyRight;?>">
		<meta name="Description"		content="When you plan to get yourself and your family a cruise vacation, where you get quotes that you use in comparing different cruise packages available Whom are the ones arranging your pre departure tours Whom you deal with when you are already on board, provi...">
		<meta name="Keywords"			content="<?=$Keywords;?>">
		<meta name="Distribution"		content="global">
		<meta name="Publisher"			content="<?=$Domain;?>">
		<meta name="Rating"				content="General">
		<meta name="Revisit-after"		content="5 days">				
		<meta name="Robots"				content="index,follow">				
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
				<td class="tdRow" colspan="2" >
					<?php $Menu = "Articles"; include("../Includes/Menu.php"); ?>
				</td>
			</tr>
			<tr>
				<td class="tdContent">
					<br>
					<p>
						<b>
Cruise Lines at your Service
</b>
<br>

						<small>

</small>
<br>
<br>

					</p>
					<?php include("../Includes/Google_336x280.php"); ?>
					<p>
						<br>When you plan to get yourself and your family a cruise vacation, where you get quotes that you use in comparing different cruise packages available? Whom are the ones arranging your pre-departure tours? <br><br>Whom you deal with when you are already on-board, providing all of your needs and ensuring your safety for the rest of your vacation?<br><br>It is all about cruise lines.<br><br>What is a Cruise Line?<br><br>A company or corporation operates the cruise ships. Cruise lines are considered to carry two purposes. First is for transportation business, and second, in the leisure entertainment business. <br><br>Aside from the administration officers and headquartered employees, cruise line personnel extends on the cruise ship, which is headed by the ship’s captain and his crew, and a hospitality staff, which is headed by the equivalent of a hotel manager.<br><br>Among the cruise lines presently operating, some of them are direct descendants of the traditional passenger shipping lines. Others were among the original cruising companies established in the early 1960’s. <br><br>Having a cruising business before is just like placing your investment on a great risk. A slight dip in cruise bookings can cause the loss of your business, since you need to recover all the expenses you have incurred from building the cruise ship.<br><br>List of Popular Cruise Lines<br><br>Currently, there are 52 cruise lines operating in the United States, Europe, Asia, and other places. Most of these cruise lines have headquarters based at the United States, and the rest to different European countries.<br><br>The following are the list of some of the cruise lines <br><br>Birka Line<br><br>An Aldanian cruise line concentrates on cruising activities at the Baltic Sea with Stockholm as the starting point. It was founded in 1971 after the acquisition of the ship M/S Princessan which is turned later to Prinsessan. It made its first cruise between Stockholm and Mariehamn.<br><br>In 1972, the Birka Line bought the M/S Olav and renamed her Baronessan. The preceding years, they have acquired few more ships. They have also car and passenger ferries on the Stockholm-Helsinki route. One of the additions is the M/S Drottningen, which is a train ferry servicing the Stockholm-Helsinki/Leningrad route.<br><br>Carnival Cruise Lines<br><br>It is now one of the subsidiaries of the Carnival Corporation, which operates different cruise lines and has become the largest corporation in the cruise industry.<br><br>Carnival Cruise Lines were the pioneer of the cheaper and shorter cruise concept. They have been able to produce larger ships, one of which is the Carnival Destiny, which is 101,000 tons and became the largest passenger ship in the world.<br><br>Currently, the company announced in the first quarter of 2006 the latest two new ships to be incorporated in their fleet. These are the carnival Freedom, which sets its debut in 2007, and the Carnival Splendor, to be launched in the spring of 2008. <br><br>Crystal Cruise Lines<br><br>Most commonly known as Crystal Cruises, Crystal Cruise Lines debuted in 1988 with its three medium-sized, high-end ships. A large Japanese shipping company Nippon Yusen Kaisha Line owns it. Their ships are regularly placed in the list of Conde Nast Traveler magazine as one of the best cruise liners. Most guidebooks also score the three ships among the top 20 of all cruise ships presently running.<br><br>Disney Cruise Lines<br><br>As the name suggests, it is owned by the famous Walt Disney Company and headquartered in Celebration, Florida. It operates two cruise ships: the Disney Magic and the Disney Wonder, along with Castaway Cay, an island in the Bahamas designed as an exclusive port of call for Disney’s ships. <br><br>The first ship, the Disney Magic, started its operation on July 30, 1998. The other one, the Disney Wonder, debuted in August 15, 1999. Each of the ship has 875 staterooms and a crew of 945. <br><br>It is relatively identical in their design, with some variations in restaurants and in entertainment sections. Both ships have areas designed for different group ages, which include toddlers, young children, teens, and adults.<br><br>Norwegian Cruise Lines<br><br>The company is based in Miami, Florida and founded as the Norwegian Caribbean Lines in 1966. It started offering cruises in the Caribbean at a low cost. <br><br>The acquisition of the cruise ship France in 1979 that is later rebuilt and named Norway, paved the way for the new era of giant cruise ships.<br><br>There are other cruise lines out there, offering different travel packages to make your cruise vacation an experience to remember.
						<br><hr style='border-style: solid; width: 90%;'><br><p><i></i></p>
					</p>
					<br>
				</td>
				<td class="tdRight">
					<?php include("../Includes/J_Box.php"); ?>
					<?php include("../Includes/Navigation.php"); ?>
					<?php include("../Includes/Google_160x600.php"); ?>
				</td>
			</tr>
			<?php					
				if($ShowNewsFeed)
					{
			?>
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
								<?php include("../Includes/NewsFeed.php"); ?>
								<?php	
									if ($DisplayAmazon)
										{
											echo "<hr>";
											echo "<br><center>";
											include("../Includes/Amazon_728x90.php");
											echo "</center><br>";
										}
								?>
							</td>
						</tr>
			<?php
					}
			?>
			<tr>
				<td class="tdRow" colspan="2">
					&copy; <?=date("Y");?>, <a href="<?=$Domain;?>"><?=$SiteName;?></a> - All Rights Reserved Worldwide | <a href="../Legal/index.php"><?=$Category;?> Legal Information</a>
				</td>
			</tr>
		</table>
		<?php include("../Includes/Footer.php"); ?>
		<?php include("../Includes/AdTracker.php"); ?>
	</body>
</html>
