#include "Atlas_I2C_PH.h"

namespace aquarius
{
	
	const string Atlas_I2C_PH::dataName[ATLAS_PH_DATA_QTY] = { ATLAS_PH_DATA_1 };
	
    int Atlas_I2C_PH::command_Calibration(string parameter, string value)
    {
        string returnString;
        string command;
        int type = -1;
        
        if(value.compare(NO_CALIBRATION_VALUE) == 0 && 
                ( parameter.compare(I2C_CAL_CLEAR) == 0 || 
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
        
        
        cout << "Command " << command << endl;
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
    
    int Atlas_I2C_PH::command_Reading()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_R, I2C_COMMAND_R_DELAY, &returnString);
        
    	if(commandResult == I2C_READ_BACK_OK)
    	{
    		string dataName[] = { ATLAS_PH_DATA_1 };
    		
    		string tempPH = returnString.substr(1);
    		
    		string datas[] = { tempPH };
    		
    		outputReadData(deviceName_, ATLAS_PH_DATA_QTY, this->dataName, datas);
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
}