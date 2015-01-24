<?php
    include('dataAccess.php');

    $result = getLastUpdate(1, $conn);

    $row = $result->fetch_assoc();
                    
    $rowObject = new DataRow($row);
?>

<!DOCTYPE html>
<html lang="en">
<head>	
	<!-- start: Meta -->
	<meta charset="utf-8">
	<title>Bootstrap Metro Dashboard by Dennis Ji for ARM demo</title>
	<meta name="description" content="Bootstrap Metro Dashboard">
	<meta name="author" content="Dennis Ji">
	<meta name="keyword" content="Metro, Metro UI, Dashboard, Bootstrap, Admin, Template, Theme, Responsive, Fluid, Retina">
	<!-- end: Meta -->
	
	<!-- start: Mobile Specific -->
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- end: Mobile Specific -->
	
	<!-- start: CSS -->
	<link id="bootstrap-style" href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/bootstrap-responsive.min.css" rel="stylesheet">
	<link id="base-style" href="css/style.css" rel="stylesheet">
	<link id="base-style-responsive" href="css/style-responsive.css" rel="stylesheet">
	<link id="style-addon-aquarius" href="css/style-addon-aquarius.css" rel="stylesheet">
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800&subset=latin,cyrillic-ext,latin-ext' rel='stylesheet' type='text/css'>
	<!-- end: CSS -->	

	<!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	  	<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<link id="ie-style" href="css/ie.css" rel="stylesheet">
	<![endif]-->
	
	<!--[if IE 9]>
		<link id="ie9style" href="css/ie9.css" rel="stylesheet">
	<![endif]-->
		
	<!-- start: Favicon -->
	<link rel="shortcut icon" href="img/favicon.ico">
	<!-- end: Favicon -->
	
		
		
		
</head>

<body>
		<!-- start: Header -->
	<div class="navbar">
		<div class="navbar-inner">
			<div class="container-fluid">
				<a class="brand" href="index.php"><span>Aquarius</span></a>		
			</div>
		</div>
	</div>
	<!-- start: Header -->
	
		<div class="container-fluid-full">
		<div class="row-fluid">
				
			<!-- start: Main Menu -->
			<div id="sidebar-left" class="span2">
				<div class="nav-collapse sidebar-nav">
					<ul class="nav nav-tabs nav-stacked main-menu">
						<li><a href="index.php"><i class="icon-bar-chart"></i><span class="hidden-tablet"> Dashboard</span></a></li>	
						<li><a href="ui.php"><i class="icon-eye-open"></i><span class="hidden-tablet"> UI Features</span></a></li>
						<li><a href="chart.php"><i class="icon-list-alt"></i><span class="hidden-tablet"> Charts</span></a></li>
					</ul>
				</div>
			</div>
			<!-- end: Main Menu -->
			
			<noscript>
				<div class="alert alert-block span10">
					<h4 class="alert-heading">Warning!</h4>
					<p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> enabled to use this site.</p>
				</div>
			</noscript>
			
			<!-- start: Content -->
			<div id="content" class="span10">			
			
			<ul class="breadcrumb">
				<li>
					<i class="icon-home"></i>
					<a href="index.php">Home</a> 
					<i class="icon-angle-right"></i>
				</li>
				<li><a href="#">Dashboard</a></li>
			</ul>
			
			<div class="row-fluid hideInIE8 circleStats">
				
				<div class="span4" onTablet="span4" onDesktop="span4">
                	<div class="circleStatsItemBox yellow">
						<div class="header">Temperature</div>
						<span class="percent">°Celcius</span>
						<div class="circleStat">
                    		<input type="text" data-width="400" value="<?php echo $rowObject->waterTemp; ?>" class="whiteCircle">
						</div>	
						<button class="btn btn-update yellow">Update</button>
                	</div>
				</div>

				<div class="span4" onTablet="span4" onDesktop="span4">
                	<div class="circleStatsItemBox red">
						<div class="header">pH</div>
						<span class="percent">pH</span>
						<div class="circleStat">
                    		<input type="text" data-width="400" value="<?php echo $rowObject->waterPh; ?>" class="whiteCircle" />
						</div>
						<button class="btn btn-update red">Update</button>
                	</div>
				</div>

				<div class="span4" onTablet="span4" onDesktop="span4">
                	<div class="circleStatsItemBox blue">
						<div class="header">Dissolved oxygen</div>
						<span class="percent">mg/L</span>
                    	<div class="circleStat">
                    		<input type="text"  data-width="400" value="<?php echo $rowObject->waterDo; ?>" class="whiteCircle" />
						</div>
						<button class="btn btn-update blue">Update</button>
                	</div>
				</div>

			</div>

			<div class="row-fluid hideInIE8 circleStats">

				<div class="span4 " onTablet="span4" onDesktop="span4">
                	<div class="circleStatsItemBox green">
						<div class="header">Conductivity</div>
						<span class="percent">S/m</span>
                    	<div class="circleStat">
                    		<input type="text" value="<?php echo $rowObject->waterConduc; ?>" class="whiteCircle" />
						</div>
						<button class="btn btn-update green">Update</button>
                	</div>
				</div>

				<div class="span4" onTablet="span4" onDesktop="span4">
                	<div class="circleStatsItemBox orange">
						<div class="header">Station Temperature</div>
						<span class="percent">°Celcius</span>
                    	<div class="circleStat">
                    		<input type="text" value="<?php echo $rowObject->caseTemp; ?>" class="whiteCircle" />
						</div>
						<button class="btn btn-update orange">Update</button>
                	</div>
				</div>

				<div class="span4" onTablet="span4" onDesktop="span4">
                	<div class="circleStatsItemBox pinkDark">
						<div class="header">Station Humidity</div>
						<span class="percent">Percent %</span>
                    	<div class="circleStat">
                    		<input type="text" value="<?php echo $rowObject->caseHum; ?>" class="whiteCircle" />
						</div>
						<button class="btn btn-update pinkDark">Update</button>
                	</div>
				</div>							
			</div>

			<div class="row-fluid">										
				<div class="box span12">
					<div class="box-header">
						<h2><i class="halflings-icon list"></i><span class="break"></span> Calibrate </h2>
						<div class="box-icon">
							<a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
						</div>
					</div>
					<div class="box-content buttons">
						<p>
							<button class="btn btn-calibrate yellow " id="btnTemp">Temperature</button>
							<button class="btn btn-calibrate red" id="btnPh">pH</button>
							<button class="btn btn-calibrate blue" id="btnDo">Dissolved Oxygen</button>
							<button class="btn btn-calibrate green"	id="btnCond">Conductivity</button>
							<button class="btn btn-calibrate orange"	id="btnSTemp" >Station Temperature</button>
							<button class="btn btn-calibrate pinkDark"	id="btnSHum">Station Humidity</button>

							<div class="box box-calibrate" id="boxCalibrate"></div>
						</p>
					</div>
				</div><!--/span-->
				
			</div><!--/row-->

			<div class="row-fluid">										
				<div class="box span12">
					<div class="box-header">
						<h2><i class="halflings-icon list"></i><span class="break"></span> Aquarius Station tools </h2>
						<div class="box-icon">
							<a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
						</div>
					</div>
					<div class="box-content buttons">
						<p>
							<button class="btn btn-large btn-primary">Update Station</button>
							<button class="btn btn-large btn-danger" id="remove-all" >Clear Warnings</button>
							<button class="btn btn-large btn-warning" id="add-date" >Get date of last update</button>

							<button class="btn btn-large btn-success">Export Database</button>
							<button class="btn btn-large btn-info">Import Database</button>
							<button class="btn btn-large btn-inverse btn-setting">Show Console</button>
						</p>


					</div>
				</div><!--/span-->
				
			</div><!--/row-->

		</div><!--/.fluid-container-->
		<!-- end: Content -->
	</div><!--/#content.span10-->
	</div><!--/fluid-row-->
		
	<div class="modal hide fade" id="myModal">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">×</button>
			<h3>Settings</h3>
		</div>
		<div class="modal-body">
			<p></p>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" data-dismiss="modal">Close</a>
			<a href="#" class="btn btn-primary">Save changes</a>
		</div>
	</div>
	
	<div class="clearfix"></div>
	
	<footer>

		<p>
			<span style="text-align:left;float:left">&copy; 2013 <a href="http://jiji262.github.io/Bootstrap_Metro_Dashboard/" alt="Bootstrap_Metro_Dashboard">Bootstrap Metro Dashboard</a></span>
			
		</p>

	</footer>
	

	<!-- start: JavaScript-->

		<script src="js/jquery-1.9.1.min.js"></script>
		<script src="js/jquery-migrate-1.0.0.min.js"></script>
	
		<script src="js/jquery-ui-1.10.0.custom.min.js"></script>
	
		<script src="js/jquery.ui.touch-punch.js"></script>
	
		<script src="js/modernizr.js"></script>
	
		<script src="js/bootstrap.min.js"></script>
	
		<script src="js/jquery.cookie.js"></script>
	
		<script src='js/fullcalendar.min.js'></script>
	
		<script src='js/jquery.dataTables.min.js'></script>

		<script src="js/excanvas.js"></script>
		<script src="js/jquery.flot.js"></script>
		<script src="js/jquery.flot.pie.js"></script>
		<script src="js/jquery.flot.stack.js"></script>
		<script src="js/jquery.flot.resize.min.js"></script>
	
		<script src="js/jquery.chosen.min.js"></script>
	
		<script src="js/jquery.uniform.min.js"></script>
		
		<script src="js/jquery.cleditor.min.js"></script>
	
		<script src="js/jquery.noty.js"></script>
	
		<script src="js/jquery.elfinder.min.js"></script>
	
		<script src="js/jquery.raty.min.js"></script>
	
		<script src="js/jquery.iphone.toggle.js"></script>
	
		<script src="js/jquery.uploadify-3.1.min.js"></script>
	
		<script src="js/jquery.gritter.js"></script>
	
		<script src="js/jquery.imagesloaded.js"></script>
	
		<script src="js/jquery.masonry.min.js"></script>
	
		<script src="js/jquery.knob.modified.js"></script>
	
		<script src="js/jquery.sparkline.min.js"></script>
	
		<script src="js/counter.js"></script>
	
		<script src="js/retina.js"></script>

		<script src="js/custom.js"></script>
	<!-- end: JavaScript-->

	<script type="text/javascript">

	$(function(){

		$('#add-date').click(function(){

			$.gritter.add({
				// (string | mandatory) the heading of the notification
				title: 'Last update',
				// (string | mandatory) the text inside the notification
				text: '<?php echo $rowObject->Date; ?>'
			});

			return false;
		});
	});
</script>


			<script>
			$( "#btnTemp" ).click(function() {
				$( "#boxCalibrate" ).switchClass("red blue green orange pinkDark","yellow");
				$( "#boxCalibrate" ).show("slow","swing");
				if( $("#boxCalibrate").hasClass("yellow") )
					 {
					 	$( "#boxCalibrate" ).hide("slow","swing");
					 	$( "#boxCalibrate" ).removeClass("yellow","slow","swing");
					 }
			});

			$( "#btnPh" ).click(function() {
				$( "#boxCalibrate" ).switchClass("yellow blue green orange pinkDark","red");
				$( "#boxCalibrate" ).show("slow","swing");
				if( $("#boxCalibrate").hasClass("red") )
					 {
					 	$( "#boxCalibrate" ).hide("slow","swing");
					 	$( "#boxCalibrate" ).removeClass("red","slow","swing");
					 }
			});

			$( "#btnDo" ).click(function() {
				$( "#boxCalibrate" ).switchClass("yellow red green orange pinkDark","blue");
				$( "#boxCalibrate" ).show("slow","swing");
				if( $("#boxCalibrate").hasClass("blue") )
					 {
					 	$( "#boxCalibrate" ).hide("slow","swing");
					 	$( "#boxCalibrate" ).removeClass("blue","slow","swing");
					 }
			});

			$( "#btnCond" ).click(function() {
				$( "#boxCalibrate" ).switchClass("yellow blue red orange pinkDark","green");
				$( "#boxCalibrate" ).show("slow","swing");
				if( $("#boxCalibrate").hasClass("green") )
					 {
					 	$( "#boxCalibrate" ).hide("slow","swing");
					 	$( "#boxCalibrate" ).removeClass("green","slow","swing");
					 }
			});

			$( "#btnSTemp" ).click(function() {
				$( "#boxCalibrate" ).switchClass("yellow blue green red pinkDark","orange");
				$( "#boxCalibrate" ).show("slow","swing");
				if( $("#boxCalibrate").hasClass("orange") )
					 {
					 	$( "#boxCalibrate" ).hide("slow","swing");
					 	$( "#boxCalibrate" ).removeClass("orange","slow","swing");
					 }
			});
			$( "#btnSHum" ).click(function() {
				$( "#boxCalibrate" ).switchClass("yellow blue green orange red","pinkDark");
				$( "#boxCalibrate" ).show("slow","swing");
				if( $("#boxCalibrate").hasClass("pinkDark") )
					 {
					 	$( "#boxCalibrate" ).hide("slow","swing");
					 	$( "#boxCalibrate" ).removeClass("pinkDark","slow","swing");
					 }
			});
			</script>

	
</body>
</html>
