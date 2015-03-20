////////////////////////////////////////////////////////////////////////////////
/**
 * Aquarius_Calibrate
 * 
 * @brief: A series a function to calibrate the sensors from the webInterface
 * 
 * @author : Jean-Pascal McGee
 * @date : 20 MAR 2015
 * @version : 0.1.2 
 * @todo : implement connection with serverSide JS
*/


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
