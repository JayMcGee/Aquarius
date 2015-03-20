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

io = io.connect()
io.emit('ready')

io.emit('requestConfig')

io.on('receiveConfig',function(data)
	{
	    var dbRows = data.rows
	    
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
function configSave(){
    
}



$("#saveButton" ).click(function() {
	var id = $("#idInput").va()
	var adresse = $("addresseInput").val()
	var interval = $( "#intervalInput" ).val()
	var date = $("#dateInput").html()
	
	
 	if( interval > 0 && interval <= 1440)
 	{
 		io.emit('configInterval', { interval: interval })
 	}
})
