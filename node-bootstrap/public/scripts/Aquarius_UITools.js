////////////////////////////////////////////////////////////////////////////////
/**
 * @brief 	Aquarius_UITools
 * 
 * @details A collection of function to manage the interface
 * 
 * @author  Jean-Pascal McGee
 * @date    13 MAY 2015
 * @version 1.0 : First Version
*/
		
	function setButtonStatus(buttonId,status)
	{
		var buttonIdString = ("#" + buttonId);
		
		if(status == 1)
		{
			$(buttonIdString).removeAttr('disabled');
		}
		else if(status == 0)
		{
			$(buttonIdString).attr('disabled','disabled');
		}
	}