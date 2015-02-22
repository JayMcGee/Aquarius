#include "Atlas_I2C.h"

namespace aquarius
{
	Atlas_I2C::Atlas_I2C(string deviceName, BlackI2C * i2c)
	{
		deviceName_ = deviceName;
		i2c_ = i2c;
	}
	
    int Atlas_I2C::command_Information()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_I, I2C_COMMAND_I_DELAY, &returnString);
        if(commandResult == I2C_READ_BACK_OK)
    	{
    		 aquarius::outputCommandResult(deviceName_, (string)INFORMATION_RESPONDED + returnString);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    	{
    		aquarius::outputError(deviceName_, I2C_READ_FAIL);
    	}
    	else if(commandResult == I2C_READ_BACK_PENDING)
    	{
    		aquarius::outputError(deviceName_, I2C_READ_PENDING);
    	}
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    	{
    		aquarius::outputError(deviceName_, I2C_READ_NO_DATA);
    	}
		else
    	{
    	    aquarius::outputError(deviceName_, I2C_COMMS_ERROR);
    	}
        return commandResult;
    }
    
    int Atlas_I2C::command_LEDControl(string parameter)
    {
        string returnString;
       
        int commandResult = aquarius::i2cCommand(i2c_, (string)I2C_COMMAND_L + I2C_DELIMITER + parameter, I2C_COMMAND_L_DELAY, &returnString);
       
        if(commandResult == I2C_READ_BACK_OK)
	    {
		   if(parameter.compare(ATLAS_LED_CONTROL_ON) == 0 || 
		                splitArguments(returnString, ',')[1].compare(ATLAS_LED_CONTROL_ON) == 0)
               aquarius::outputCommandResult(deviceName_, (string)LED_SET + LED_ON);
           else if(parameter.compare(ATLAS_LED_CONTROL_OFF) == 0 ||
                        splitArguments(returnString, ',')[1].compare(ATLAS_LED_CONTROL_OFF) == 0)
               aquarius::outputCommandResult(deviceName_, (string)LED_SET + LED_OFF);
           else
                aquarius::outputError(deviceName_, I2C_READ_FAIL);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    		aquarius::outputError(deviceName_, I2C_READ_FAIL);
    	else if(commandResult == I2C_READ_BACK_PENDING)
    		aquarius::outputError(deviceName_, I2C_READ_PENDING);
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    		aquarius::outputError(deviceName_, I2C_READ_NO_DATA);
		else
    	    aquarius::outputError(deviceName_, I2C_COMMS_ERROR);
    	return commandResult;
       
    }
    
    int Atlas_I2C::command_Sleep()
    {
        string returnString;
        aquarius::i2cCommand(i2c_, I2C_COMMAND_SLEEP, I2C_COMMAND_SLEEP_DELAY, &returnString);
        aquarius::outputCommandResult(deviceName_, SLEEP_MODE_ENABLED);
        return I2C_READ_BACK_OK;
    }
    
    int Atlas_I2C::command_Status()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_STATUS, I2C_COMMAND_STATUS_DELAY, &returnString);
        if(commandResult == I2C_READ_BACK_OK)
    	{
    		 aquarius::outputCommandResult(deviceName_, (string)STATUS_RESPONDED + returnString);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    	{
    		aquarius::outputError(deviceName_, I2C_READ_FAIL);
    	}
    	else if(commandResult == I2C_READ_BACK_PENDING)
    	{
    		aquarius::outputError(deviceName_, I2C_READ_PENDING);
    	}
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    	{
    		aquarius::outputError(deviceName_, I2C_READ_NO_DATA);
    	}
		else
    	{
    	    aquarius::outputError(deviceName_, I2C_COMMS_ERROR);
    	}
        return commandResult;
    }
    
    int Atlas_I2C::command_Temperature_Compensation(string parameter)
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_T, I2C_COMMAND_T_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
		    if(parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
                aquarius::outputCommandResult(deviceName_, (string)COMPENSATION_RESPONDED + splitArguments(returnString, ',')[1]);
            else
                aquarius::outputCommandResult(deviceName_, (string)COMPENSATION_SET_RESPONDED + parameter);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    		aquarius::outputError(deviceName_, I2C_READ_FAIL);
    	else if(commandResult == I2C_READ_BACK_PENDING)
    		aquarius::outputError(deviceName_, I2C_READ_PENDING);
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    		aquarius::outputError(deviceName_, I2C_READ_NO_DATA);
		else
    	    aquarius::outputError(deviceName_, I2C_COMMS_ERROR);
    	return commandResult;
    }
    
    int Atlas_I2C::command_Factory_Reset()
    {
        string returnString;
        aquarius::i2cCommand(i2c_, I2C_COMMAND_X, I2C_COMMAND_X_DELAY, &returnString);
        aquarius::outputCommandResult(deviceName_, FACTORY_RESET);
        return I2C_READ_BACK_OK;
    }
	
	/**
	 * @brief Output the missing arguments phrase for help
	 * @return A string that explains the minimum args for the driver to work
	 */
	string Atlas_I2C::output_missingArguments()
	{
		return "Missing arguments, could not execute \n\r [Executable] [bus:address] [command]";
	}
}