#include "Atlas_I2C_PH.h"

namespace aquarius
{
	
    int Atlas_I2C_PH::command_Calibration(string parameter, string value)
    {
        string returnString;
        string command;
        int type = -1;
        
        if(value.compare(NO_CALIBRATION_VALUE) == 0 && 
                ( parameter.compare(PH_COMMAND_CLEAR) == 0 || 
                    parameter.compare(I2C_COMMAND_ARG_QUEST) == 0))
        {
           command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter;
           type = 0;
        }
        else if(value.compare(NO_CALIBRATION_VALUE) != 0 && 
                 ( parameter.compare(PH_COMMAND_MID) == 0 || 
                    parameter.compare(PH_COMMAND_HIGH) == 0 || 
                        parameter.compare(PH_COMMAND_LOW) == 0))
        {
            command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter + I2C_DELIMITER + value;
            type = 1;
        }
        
        int commandResult = aquarius::i2cCommand(i2c_,command, I2C_COMMAND_CALIB_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
    	    if(type)
    		    aquarius::outputCommandResult(deviceName_, (string)CALIBRATION_SUCCESSFULL_P1 + value + CALIBRATION_SUCCESSFULL_P2 + parameter);
    		else
    		    aquarius::outputCommandResult(deviceName_, (string)CALIBRATION_QUERIED + splitArguments(returnString, ',')[1]);
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
/*
    int command_Information(BlackI2C * i2c, string deviceName)
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c, I2C_COMMAND_I, I2C_COMMAND_I_DELAY, &returnString);
        if(commandResult == I2C_READ_BACK_OK)
    	{
    		 aquarius::outputCommandResult(deviceName, (string)INFORMATION_RESPONDED + returnString);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    	{
    		aquarius::outputError(deviceName, I2C_READ_FAIL);
    	}
    	else if(commandResult == I2C_READ_BACK_PENDING)
    	{
    		aquarius::outputError(deviceName, I2C_READ_PENDING);
    	}
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    	{
    		aquarius::outputError(deviceName, I2C_READ_NO_DATA);
    	}
		else
    	{
    	    aquarius::outputError(deviceName, I2C_COMMS_ERROR);
    	}
        return commandResult;
    }
    
    int command_LEDControl(BlackI2C * i2c, string deviceName, string parameter)
    {
        string returnString;
       
        int commandResult = aquarius::i2cCommand(i2c, (string)I2C_COMMAND_L + I2C_DELIMITER + parameter, I2C_COMMAND_L_DELAY, &returnString);
       
        if(commandResult == I2C_READ_BACK_OK)
	    {
		   if(parameter.compare(ATLAS_LED_CONTROL_ON) == 0 || 
		                splitArguments(returnString, ',')[1].compare(ATLAS_LED_CONTROL_ON) == 0)
               aquarius::outputCommandResult(deviceName, (string)LED_SET + LED_ON);
           else if(parameter.compare(ATLAS_LED_CONTROL_OFF) == 0 ||
                        splitArguments(returnString, ',')[1].compare(ATLAS_LED_CONTROL_OFF) == 0)
               aquarius::outputCommandResult(deviceName, (string)LED_SET + LED_OFF);
           else
                aquarius::outputError(deviceName, I2C_READ_FAIL);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    		aquarius::outputError(deviceName, I2C_READ_FAIL);
    	else if(commandResult == I2C_READ_BACK_PENDING)
    		aquarius::outputError(deviceName, I2C_READ_PENDING);
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    		aquarius::outputError(deviceName, I2C_READ_NO_DATA);
		else
    	    aquarius::outputError(deviceName, I2C_COMMS_ERROR);
    	return commandResult;
       
    }*/
    
    int Atlas_I2C_PH::command_Reading()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_R, I2C_COMMAND_R_DELAY, &returnString);
        
    	if(commandResult == I2C_READ_BACK_OK)
    	{
    		string dataName[] = { ATLAS_PH_DATA_1 };
    		
    		string tempPH = returnString.substr(1);
    		
    		float datas[] = { (float)atof(tempPH.c_str()) };
    		
    		aquarius::outputReadData(deviceName_, ATLAS_PH_DATA_QTY, dataName, datas);
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
    /*
    int command_Sleep(BlackI2C * i2c, string deviceName)
    {
        string returnString;
        aquarius::i2cCommand(i2c, I2C_COMMAND_SLEEP, I2C_COMMAND_SLEEP_DELAY, &returnString);
        aquarius::outputCommandResult(deviceName, SLEEP_MODE_ENABLED);
        return I2C_READ_BACK_OK;
    }
    
    int command_Status(BlackI2C * i2c, string deviceName)
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c, I2C_COMMAND_STATUS, I2C_COMMAND_STATUS_DELAY, &returnString);
        if(commandResult == I2C_READ_BACK_OK)
    	{
    		 aquarius::outputCommandResult(deviceName, (string)STATUS_RESPONDED + returnString);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    	{
    		aquarius::outputError(deviceName, I2C_READ_FAIL);
    	}
    	else if(commandResult == I2C_READ_BACK_PENDING)
    	{
    		aquarius::outputError(deviceName, I2C_READ_PENDING);
    	}
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    	{
    		aquarius::outputError(deviceName, I2C_READ_NO_DATA);
    	}
		else
    	{
    	    aquarius::outputError(deviceName, I2C_COMMS_ERROR);
    	}
        return commandResult;
    }
    
    int command_Temperature_Compensation(BlackI2C * i2c, string deviceName, string parameter)
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c, I2C_COMMAND_T, I2C_COMMAND_T_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
		    if(parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
                aquarius::outputCommandResult(deviceName, (string)COMPENSATION_RESPONDED + splitArguments(returnString, ',')[1]);
            else
                aquarius::outputCommandResult(deviceName, (string)COMPENSATION_SET_RESPONDED + parameter);
    	}
    	else if(commandResult == I2C_READ_BACK_FAIL)
    		aquarius::outputError(deviceName, I2C_READ_FAIL);
    	else if(commandResult == I2C_READ_BACK_PENDING)
    		aquarius::outputError(deviceName, I2C_READ_PENDING);
    	else if(commandResult == I2C_READ_BACK_NO_DATA)
    		aquarius::outputError(deviceName, I2C_READ_NO_DATA);
		else
    	    aquarius::outputError(deviceName, I2C_COMMS_ERROR);
    	return commandResult;
    }
    
    int command_Factory_Reset(BlackI2C * i2c, string deviceName)
    {
        string returnString;
        aquarius::i2cCommand(i2c, I2C_COMMAND_X, I2C_COMMAND_X_DELAY, &returnString);
        aquarius::outputCommandResult(deviceName, FACTORY_RESET);
        return I2C_READ_BACK_OK;
    }
    */
}