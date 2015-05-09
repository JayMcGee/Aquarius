/**
 * @file   Atlas_I2C_DO.cpp
 * @author Jean-Philippe Fournier and Jean-Pascal McGee
 * @date   Febuary 18 2015
 * @brief  Implementation of function calls to Atlas I2C DO stamp
 */

#include "Atlas_I2C_DO.h"

namespace aquarius
{	
    //Output data names
	const string Atlas_I2C_DO::dataName[ATLAS_DO_DATA_QTY] = { ATLAS_DO_DATA_1, ATLAS_DO_DATA_2 };
	
    /**
     * @brief Calibrates the device
     * 
     * @param parameter calibration parameter (query, level)
     * @param value value for calibration, NO_CALIBRATION_VALUE is default
     * 
     * @return I2C commande result code
     */
    int Atlas_I2C_DO::command_Calibration(string parameter, string value)
    {
        string returnString;
		string command;
		
        //Check parameter to select which command format
		if(parameter.compare(DO_CAL_AIR) == 0)
			command = (string)I2C_COMMAND_CALIB;
		else
			command = (string)I2C_COMMAND_CALIB + I2C_DELIMITER + parameter;
			
        int type = -1;
        
        //If is not a calibration sequence but a clear or question mark
		if (parameter.compare(I2C_CAL_CLEAR) == 0 || parameter.compare(I2C_COMMAND_ARG_QUEST) == 0)
           type = 0;
        else if(parameter.compare(DO_CAL_AIR) == 0 || parameter.compare(DO_CAL_0_O) == 0 )
            type = 1;

        //Execute command on device and read answer
        int commandResult = aquarius::i2cCommand(i2c_,command, I2C_COMMAND_CALIB_DELAY, &returnString);
        
        //If I2C response is OK
        if(commandResult == I2C_READ_BACK_OK)
    	{
            //Ouput correctly
    	    if(type == 1)
    		    aquarius::outputCommandResult(deviceName_, (string)CALIBRATION_SUCCESSFULL_P1 + parameter);
			else if (type == 0)
    		    aquarius::outputCommandResult(deviceName_, (string)CALIBRATION_QUERIED + splitArguments(returnString, ',')[1]);
				
    	}
        //Else output error message
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
    
    /**
     * @brief Outputs a reading
     * @details Using the common aquarius output system, read and output the sensor
     * @return I2C commande result code
     */
    int Atlas_I2C_DO::command_Reading()
    {
        string returnString;
        int commandResult = aquarius::i2cCommand(i2c_, I2C_COMMAND_R, I2C_COMMAND_R_DELAY, &returnString);
        
    	if(commandResult == I2C_READ_BACK_OK)
    	{
    		vector<string> split = aquarius::splitArguments(returnString, ',');
			
			if(split.size() >= ATLAS_DO_DATA_QTY)
			{
				string dataName[] = { ATLAS_DO_DATA_1, ATLAS_DO_DATA_2};
    		
                //Split data efficiently to remove garabage output
				string prct = split[1].erase(0, split[1].find_first_not_of(' '));
				string Do = split[0].erase(0, split[0].find_first_not_of('?'));
				string datas[] = {prct, Do};
				
                //Output read data
				aquarius::outputReadData(deviceName_, ATLAS_DO_DATA_QTY, this->dataName, datas);
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
	
    /**
     * @brief Changes the output string from the device
     * @details Use with caution, can alter the reading functions accuracy
     * 
     * @param parameter Command parameter
     * @param enable Enable/Disable the output
     * 
     * @return I2C commande result code
     */
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
	
     /**
     * @brief Pressure compensation command
     * @details Set the pressure compensation on the device
     * 
     * @param parameter The pressure parameter or query parameter
     * @return I2C commande result code
     */		
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