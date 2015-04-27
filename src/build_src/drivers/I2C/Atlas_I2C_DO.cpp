#include "Atlas_I2C_DO.h"

namespace aquarius
{
	
    int Atlas_I2C_DO::command_Calibration(string parameter, string value)
    {
        string returnString;
		string command;
		
		if(parameter.compare(DO_CAL_AIR) == 0)
			command = (string)I2C_COMMAND_CALIB;
		else
			command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter;
			
        int type = -1;
        
		if (parameter.compare(I2C_CAL_CLEAR) == 0 || parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
           type = 0;
        else if(parameter.compare(DO_CAL_AIR) == 0 || parameter.compare(DO_CAL_0_O) == 0 )
            type = 1;

        int commandResult = aquarius::i2cCommand(i2c_,command, I2C_COMMAND_CALIB_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
    	    if(type == 1)
    		    aquarius::outputCommandResult(deviceName_, (string)CALIBRATION_SUCCESSFULL_P1 + parameter);
			else if (type == 0)
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
    
    int Atlas_I2C_DO::command_Reading()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_R, I2C_COMMAND_R_DELAY, &returnString);
        
    	if(commandResult == I2C_READ_BACK_OK)
    	{
    		//cout << "Returned string : " << returnString << endl;
    		vector<string> split = aquarius::splitArguments(returnString, ',');
			
			if(split.size() >= ATLAS_DO_DATA_QTY)
			{
				string dataName[] = { ATLAS_DO_DATA_1, ATLAS_DO_DATA_2};
    		
				string prct = split[1].substr(1);
				string Do = split[0];
				
				float datas[] = { (float)atof(prct.c_str()),
								(float)atof(Do.c_str())};
				
				aquarius::outputReadData(deviceName_, ATLAS_DO_DATA_QTY, dataName, datas);
			}
			else
			{
				commandResult = I2C_READ_BACK_FAIL;
				aquarius::outputError(deviceName_, I2C_READ_FAIL);
			}   
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
	
	int Atlas_I2C_DO::command_Output_String_Config(string parameter, string enable)
	{
		string returnString;
		string command = (string)DO_COMMAND_O + I2C_DELIMITER + parameter;
		int setting = 0;
		if(enable.compare(NO_CALIBRATION_VALUE) != 0)
		{
			command += (string)I2C_DELIMITER + enable;	
			setting++;
		}
		int commandResult = aquarius::i2cCommand(i2c_, command, DO_COMMAND_O_DELAY, &returnString);
		
		if(commandResult == I2C_READ_BACK_OK)
    	{
			if(setting)
			{
				aquarius::outputCommandResult(deviceName_, (string)DO_OUTPUT_SET_AT + enable);
			}
			else
			{
				aquarius::outputCommandResult(deviceName_, (string)DO_OUTPUT_IS_AT + returnString);
			}
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
			
	int Atlas_I2C_DO::command_Pressure(string parameter)
	{
		string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, DO_COMMAND_P, DO_COMMAND_P_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
		    if(parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
                aquarius::outputCommandResult(deviceName_, (string)DO_COMPENSATION_PRESSURE + splitArguments(returnString, ',')[1]);
            else
                aquarius::outputCommandResult(deviceName_, (string)DO_COMPENSATION_SET_PRESSURE + parameter);
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
	
	int Atlas_I2C_DO::command_Salinity(string parameter)
	{
		string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, DO_COMMAND_S, DO_COMMAND_S_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
		    if(parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
                aquarius::outputCommandResult(deviceName_, (string)DO_COMPENSATION_SALINITY + splitArguments(returnString, ',')[1]);
            else
                aquarius::outputCommandResult(deviceName_, (string)DO_COMPENSATION_SET_SALINITY + parameter);
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
}