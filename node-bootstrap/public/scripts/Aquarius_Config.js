////////////////////////////////////////////////////////////////////////////////
/**
 * Aquarius_Config
 * 
 * @brief:  Generates the configuration page
 *          based on the database T_Config page      
 *           
 * @author : Jean-Pascal McGee
 * @date : 20 MAR 2015
 * @version : 0.1.1
*/

//Var Global
var dbRows = [];

/**
 * @brief Display the datePicker in the right format
 */
$('#datetimepicker1').datetimepicker({
    format: 'dd/MM/yyyy hh:mm:ss',
    language: 'pt-BR'
});
var picker = $('#datetimepicker1').data('datetimepicker')

io = io.connect();
io.emit('ready');

io.emit('RequestConfig');

/**
 * @brief 	ReceiveConfig,  
 * @details Receive the most recent config in the dataBase
 */
io.on('ReceiveConfig',function( data ){
    dbRows = data.row;
    
    for ( var i = 0; i < dbRows.length; i++)
    {
        var id    = dbRows[i].Id;
        var name  = dbRows[i].Name;
        var value = dbRows[i].Value;
        var desc  = dbRows[i].Description;
        
        if(name == "STATION_ID")
        {
            $("#idInput").val(value);
        }
        else if(name == "SENSOR_UNIT")
        {
        	$("#unitInput").val(value);
        }
        else if(name == "NUMBER_RETRIES")
        {
             $("#retriesInput").val(value);
        }
        else if(name == "SEND_ADDRESS")
        {
            $("#addressInput").val(value);
        }
        else if (name == "READ_INTERVAL")
        {
         	$("#intervalInput").val(value);   
        }
        else if (name == "LAST_KNOWN_DATE")
        {
            $("#dateInput").html(value);
        }
        else if (name == "DEBUG_LEVEL")
        {
        	$("#debugLevel").val(value);
        }
    }
})


/**
 * @brief Send keyName and Value to update configuration
 * @param KeyName (string)
 * @param Value (var)
 */
function sendConfig(KeyName,Value){
    io.emit('UpdateConfig',{'Name': KeyName, 'Value': Value})
}

/**
 * @brief saveButton, sends the config to the database
 */
$("#saveButton" ).click(function() {
    
     var localDate = picker.getLocalDate()
     //alert(localDate)
     
     for ( var i = 0; i < dbRows.length; i++)
	    {
	        var id    = dbRows[i].Id
	        var name  = dbRows[i].Name
	        var value = dbRows[i].Value
	        var desc  = dbRows[i].Description
	        
	        if(name == "STATION_ID")
	        {
	           if( $("#idInput").val() !== value )
	           {
	               sendConfig(name,$("#idInput").val())
	               dbRows[i].Value = $("#idInput").val()
	           }
	        }
	        else if(name == "NUMBER_RETRIES")
	        {
	            if($("#retriesInput").val() !== value)
	            {
	                sendConfig(name,$("#retriesInput").val())
	                dbRows[i].Value = $("#retriesInput").val()
	            }
	        }
	        else if(name == "SEND_ADDRESS")
	        {
	            if($("#addressInput").val() !== value)
	            {
	                sendConfig(name,$("#addressInput").val())
	                dbRows[i].Value = $("#addressInput").val()
	            }
	        }
	        else if (name == "READ_INTERVAL")
	        {
	         	if($("#intervalInput").val() !== value)
	         	{
	         	    sendConfig(name,$("#intervalInput").val())
	         	    dbRows[i].Value = $("#intervalInput").val()
	         	}
	        }
	        else if (name == "LAST_KNOWN_DATE")
	        {
	            if(localDate !== value)
	            {
	                sendConfig(name,localDate);
	                dbRows[i].Value = localDate;
	            }
	        }
	    }
})
