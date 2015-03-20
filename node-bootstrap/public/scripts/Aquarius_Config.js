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

var dbRows = []

io = io.connect()
io.emit('ready')

io.emit('requestConfig')

io.on('receiveConfig',function(data)
	{
	    dbRows = data.rows
	    
	    for ( var i = 0; i < dbRows.length; i++)
	    {
	        var id    = dbRows[i].Id
	        var name  = dbRows[i].Name
	        var value = dbRows[i].Value
	        var desc  = dbRows[i].Description
	        
	        if(name == "STATION_ID")
	        {
	            $("#idInput").val(value)
	        }
	        else if(name == "NUMBER_RETRIES")
	        {
	             $("#retriesInput").val(value)
	        }
	        else if(name == "SEND_ADDRESS")
	        {
	            $("#addressInput").val(value)
	        }
	        else if (name == "READ_INTERVAL")
	        {
	         	$("#intervalInput").val(value)   
	        }
	        else if (name == "LAST_KNOWN_DATE")
	        {
	            $("#dateInput").html(value)
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



$("#saveButton" ).click(function() {
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
	               sendConfig(name,value)
	           }
	        }
	        else if(name == "NUMBER_RETRIES")
	        {
	            if($("#retriesInput").val() !== value)
	            {
	                sendConfig(name,value)
	            }
	        }
	        else if(name == "SEND_ADDRESS")
	        {
	            if($("#addressInput").val() !== value)
	            {
	                sendConfig(name,value)
	            }
	        }
	        else if (name == "READ_INTERVAL")
	        {
	         	if($("#intervalInput").val(value) !== value)
	         	{
	         	    sendConfig(name,value)
	         	}
	        }
	        else if (name == "LAST_KNOWN_DATE")
	        {
	            if($("#dateInput").html(value) !== value)
	            {
	                sendConfig(name,value)
	            }
	        }
	    }
})
