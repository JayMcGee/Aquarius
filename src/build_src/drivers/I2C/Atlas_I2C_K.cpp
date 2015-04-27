#include "Atlas_I2C_K.h"

namespace aquarius
{
	//TEST
	int Atlas_I2C_K::command_Calibration(string parameter, string value)
	{
		string returnString;
		string command;
		int type = -1;

		if (value.compare(NO_CALIBRATION_VALUE) == 0 &&
			(parameter.compare(I2C_CAL_CLEAR) == 0 ||
			parameter.compare(I2C_COMMAND_ARG_QUEST) == 0))
		{
			command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter;
			type = 0;
		}
		else if (parameter.compare(K_CAL_DRY) == 0)
		{
			command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter;
			type = 1;
		}
        else if(value.compare(NO_CALIBRATION_VALUE) != 0 && 
				(parameter.compare(K_CAL_ONE) == 0 ||
				parameter.compare(K_CAL_LOW) == 0 ||
				parameter.compare(K_CAL_HIGH) == 0))
        {
            command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter + I2C_DELIMITER + value;
            type = 1;
        }
        
        int commandResult = aquarius::i2cCommand(i2c_,command, I2C_COMMAND_CALIB_DELAY, &returnString);
        
        if(commandResult == I2C_READ_BACK_OK)
    	{
    		if(parameter.compare(I2C_CAL_CLEAR) == 0){
    			string secondCommand = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + K_CAL_DRY; 
    			int commandResult2 = aquarius::i2cCommand(i2c_,command, I2C_COMMAND_CALIB_DELAY, &returnString);
    		}
    		
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
	//TEST
	int Atlas_I2C_K::command_Reading()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_R, I2C_COMMAND_R_DELAY, &returnString);
        
    	if(commandResult == I2C_READ_BACK_OK)
    	{
    		//cout << "returned string : " << returnString << endl;
    		
			vector<string> split = aquarius::splitArguments(returnString, ',');
			
			if(split.size() >= ATLAS_K_DATA_QTY)
			{
				string dataName[] = { ATLAS_K_DATA_1, ATLAS_K_DATA_2, ATLAS_K_DATA_3, ATLAS_K_DATA_4 };
    		
				string ec = split[0].substr(1);
				string tds = split[1];
				string sal = split[2];
				string sg = split[3];
				
				float datas[] = { (float)atof(ec.c_str()),
									(float)atof(tds.c_str()),
									(float)atof(sal.c_str()),
									(float)atof(sg.c_str())};
				
				aquarius::outputReadData(deviceName_, ATLAS_K_DATA_QTY, dataName, datas);
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
	//TEST
	int Atlas_I2C_K::command_K_Constant(string parameter)
	{
		string returnString;

		string command = (string)K_COMMAND_K + I2C_DELIMITER + parameter;

		int commandResult = aquarius::i2cCommand(i2c_, command, K_COMMAND_K_DELAY, &returnString);
		if (commandResult == I2C_READ_BACK_OK)
		{
			if (parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
				aquarius::outputCommandResult(deviceName_, (string)K_CONSTANT_AT + splitArguments(returnString, ',')[1]);
			else
				aquarius::outputCommandResult(deviceName_, (string)K_CONSTANT_SET + parameter);
		}
		else if (commandResult == I2C_READ_BACK_FAIL)
			aquarius::outputError(deviceName_, I2C_READ_FAIL);
		else if (commandResult == I2C_READ_BACK_PENDING)
			aquarius::outputError(deviceName_, I2C_READ_PENDING);
		else if (commandResult == I2C_READ_BACK_NO_DATA)
			aquarius::outputError(deviceName_, I2C_READ_NO_DATA);
		else
			aquarius::outputError(deviceName_, I2C_COMMS_ERROR);
		return commandResult;

	}
	//TEST
	int Atlas_I2C_K::command_Output_String_Config(string parameter, string enable)
	{
		string returnString;
		string command = (string)K_COMMAND_O + I2C_DELIMITER + parameter;
		int setting = 0;
		if (enable.compare(NO_CALIBRATION_VALUE) != 0)
		{
			command += (string)I2C_DELIMITER + enable;
			setting++;
		}
		int commandResult = aquarius::i2cCommand(i2c_, command, K_COMMAND_O_DELAY, &returnString);

		if (commandResult == I2C_READ_BACK_OK)
		{
			if (setting)
			{
				aquarius::outputCommandResult(deviceName_, (string)K_OUTPUT_SET_AT + enable);
			}
			else
			{
				aquarius::outputCommandResult(deviceName_, (string)K_OUTPUT_IS_AT + returnString);
			}
		}
		else if (commandResult == I2C_READ_BACK_FAIL)
		{
			aquarius::outputError(deviceName_, I2C_READ_FAIL);
		}
		else if (commandResult == I2C_READ_BACK_PENDING)
		{
			aquarius::outputError(deviceName_, I2C_READ_PENDING);
		}
		else if (commandResult == I2C_READ_BACK_NO_DATA)
		{
			aquarius::outputError(deviceName_, I2C_READ_NO_DATA);
		}
		else
		{
			aquarius::outputError(deviceName_, I2C_COMMS_ERROR);
		}
		return commandResult;
	}

    
}