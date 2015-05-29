////////////////////////////////////////////////////////////////////////////////
/**
 * @brief 	Aquarius_Calibrate
 * 
 * @details A series a function to calibrate the sensors from the webInterface
 * 
 * @author  Jean-Pascal McGee
 * @date    20 MAR 2015
 * @version 1.0 : First Version, only manage boxCalibrate display
 * @version 2.0 : Added calibration point buttons manager
 * @version 3.0 : Added communication with server and enable button logic
*/


///////////////// INTERFACE  /////////////////////
/**
 * @brief When a calibrate button is pressed show the boxCalibrate div
 * 		  then swhitch to the color coresponding to the sensor.
 * @brief If the button is pressed while the box is opened change the color
 * @brief If the button is pressed while the box is opened AND the color is 
 * 		  already corresponding to the sensor, hide the boxCalibrate 
 */
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

///////////////// Manage Buttons  /////////////////////
/**
 * @brief 	Manage calibration point buttons
 * @details When a calibrationPoint button is pressed send a signal to the server
 * 			if the calibrationPoint requires a value, it will send it along the
 * 		  	other parameters.
 */
/////// Ph Calibrate
$("#midPointBtn_ph").click(function(){
	sendCalibrationEmit(1,"mid", 7);
});
$("#lowPointBtn_ph").click(function(){
	sendCalibrationEmit(1,"low", $("#lowPoint_ph").val());
});
$("#highPointBtn_ph").click(function(){
	sendCalibrationEmit(1,"high",$("#highPoint_ph").val());
});
$("#clearBtn_ph").click(function(){
	sendCalibrationEmit(1,"clear");
});
/////// Do Calibrate
$("#ambientBtn_do").click(function(){
	sendCalibrationEmit(4,"Oxy");
})
$("#zeroBtn_do").click(function(){
	sendCalibrationEmit(4,"0");
});
$("#clearBtn_do").click(function(){
	sendCalibrationEmit(4,"clear");
});
/////// Cond Calibrate
$("#dryPointBtn_cond").click(function(){
	sendCalibrationEmit(5,"dry");
});
$("#lowPointBtn_cond").click(function(){
	sendCalibrationEmit(5,"low", $("#lowPoint_cond").val() );
});
$("#highPointBtn_cond").click(function(){
	sendCalibrationEmit(5,"high",$("#highPoint_cond").val());
});
$("#clearBtn_cond").click(function(){
	sendCalibrationEmit(5,"clear");
});
$("#onePointBtn_cond").click(function(){
	sendCalibrationEmit(5,"one");
});

///////////////// SendCalibrationEmit  /////////////////////
/**
 * @brief	SendCalibrationEmit
 * @details Sends a signal to the server, the signal is made of 
 * 		  	the SensorID, the point at wich we will calibrate 
 * 		  	and if necessary the value of the point.
 */

function sendCalibrationEmit(id,point,value)
{
	if( value == null){
		io.emit('calibration',{Id:id, Point:point, Value:null});
	}
	else{
		io.emit('calibration',{Id:id, Point:point, Value:value});
	}
}

///////////////// ON calibrationSuccess /////////////////////
/**
 * @brief	OnCalibraionSucess
 * @details The server answer's after calibration
 * 		  	If the calibration is successful the server will answer, 
 * 		  	the interface will then enable the button of the next step.
 */
io.on('calibrationSuccess',function(data){
	if(data.sensorId == 1){
		if(data.status == 1)
		{
			setButtonStatus("lowPointBtn_ph",1);
		}
		if(data.status == 2)
		{
			setButtonStatus("highPointBtn_ph",1);
		}
		if(data.status == 0)
		{
			setButtonStatus("lowPointBtn_ph",0);
			setButtonStatus("highPointBtn_ph",0);
		}
	}
	else if(data.sensorId == 4){
		if(data.status == 1)
		{
			setButtonStatus("zeroBtn_do",1);
		}
		if(data.status == 0)
		{
			setButtonStatus("zeroBtn_do",0);
		}
	}
	else if(data.sensorId == 5){
		if(data.status == 0)
		{
			setButtonStatus("lowPointBtn_cond",1);
			setButtonStatus("highPointBtn_cond",1);
			setButtonStatus("onePointBtn_cond", 1)
		}
		if(data.status == -1)
		{
			setButtonStatus("lowPointBtn_cond",0);
			setButtonStatus("highPointBtn_cond",0);
			setButtonStatus("onePointBtn_cond", 0)
		}
	}
});

io.on('calibrationFailure',function(data){
	alert("Calibration failed");
});