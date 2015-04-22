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


//////////// INTERFACE
$( "#btnPh" ).click(function() {
	$( "#boxCalibrate" ).switchClass("yellow  green","red");
	$( "#boxCalibrate" ).show("slow","swing");
	
	$( "#caliPh").show("slow","swing");
	$( "#caliDo").hide("slow","swing");
	$( "#caliCond").hide("slow","swing");
	
	if( $("#boxCalibrate").hasClass("red") )
    {
        $( "#boxCalibrate" ).hide("slow","swing");
        $( "#boxCalibrate" ).removeClass("red","slow","swing");
        $( "#caliPh").hide("slow","swing");
    }
});

$( "#btnDo" ).click(function() {
	$( "#boxCalibrate" ).switchClass("red green","yellow");
	$( "#boxCalibrate" ).show("slow","swing");
	
	$( "#caliDo").show("slow","swing");
	$( "#caliPh").hide("slow","swing");
	$( "#caliCond").hide("slow","swing");
	
	if( $("#boxCalibrate").hasClass("yellow") )
		 {
		 	$( "#boxCalibrate" ).hide("slow","swing");
		 	$( "#boxCalibrate" ).removeClass("yellow","slow","swing");
		 	$( "#caliDo").hide("slow","swing");
		 }
});

$( "#btnCond" ).click(function() {
	$( "#boxCalibrate" ).switchClass("yellow red","green");
	$( "#boxCalibrate" ).show("slow","swing");
	
	$( "#caliCond").show("slow","swing");
	$( "#caliPh").hide("slow","swing");
	$( "#caliDo").hide("slow","swing");
	
	if( $("#boxCalibrate").hasClass("green") )
		 {
		 	$( "#boxCalibrate" ).hide("slow","swing");
		 	$( "#boxCalibrate" ).removeClass("green","slow","swing");
		 	$( "#caliCond").hide("slow","swing");
		 }
});

