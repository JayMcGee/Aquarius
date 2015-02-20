#include "../../commun.h"
#include <iostream>
#include <stdlib.h>
#include "Atlas_PH.h"

#define PH_TEMP_NAME "PH_001"
using namespace BlackLib;
using namespace std;


int main(int argc, char * argv[])
{
    string returnString;
    
    if(argc < 3)
    {
        cout << aquarius::AtlasPH_output_missingArguments() << endl;
        return 1;
    }
    string deviceLocation;
    deviceLocation.assign(argv[1]);
    
    vector<string> deviceLocationSplitted{aquarius::splitArguments(deviceLocation, ':')};
    
    if(deviceLocationSplitted.size() < 2)
    {
        cout << "Not enough I2C location information, must be [bus:address]" << endl;  
        return 1;
    }
    
    BlackLib::i2cName bus;
    
    int bus_number = atoi(deviceLocationSplitted[0].c_str());
    
    if(bus_number == 0)
    {
        bus = BlackLib::I2C_0;
    }
    else if(bus_number == 1)
    {
        bus = BlackLib::I2C_1;
    }
    else
    {
        cout << "I2C bus can be 0 or 1" << endl;  
        return 1;
    }
    
    int address = atoi(deviceLocationSplitted[1].c_str());
    
    if(address > 255 && address <= 0)
    {
        cout << "I2C address must be smaller than 255, and higher or equal to 0" << endl;  
        return 1;
    }
    
    BlackI2C myI2c(bus, address);
    myI2c.open( BlackLib::ReadWrite | BlackLib::NonBlock);
    
    string command;
    command.assign(argv[2]);    
    vector<string> commandSplitted{aquarius::splitArguments(command, ':')};
	string firstCommand = commandSplitted[0];
	
	
	int commandResult;	
	string finalCommand;
    ////////////////////////////********COMMAND BUILDING**********////////////////////
    //Creates i2c command
	//If command is calibration 	
	if(firstCommand.compare(PH_COMMAND_CALIB) == 0)
	{
		//Verify that there is the minimum second argument
		if(commandSplitted.size() > 2)
		{
			return aquarius::command_Calibration(&myI2c, PH_TEMP_NAME, commandSplitted[1], commandSplitted[2]);
		}
		else if(commandSplitted.size() > 1)
		{
			return aquarius::command_Calibration(&myI2c, PH_TEMP_NAME, commandSplitted[1]);
		}
		else
		{
			aquarius::outputError(PH_TEMP_NAME, NOT_ENOUGH_PARAMS);
			return 1;
		}
	}   
	//Device LED control
	else if(firstCommand.compare(PH_COMMAND_L) == 0)
	{
		if(commandSplitted.size() > 1)
		{
			if(commandSplitted[1].compare(ATLAS_LED_CONTROL_ON) ||
			   commandSplitted[1].compare(ATLAS_LED_CONTROL_OFF) ||
			   commandSplitted[1].compare(PH_COMMAND_ARG_QUEST))
		   	{
		   		finalCommand = (string)firstCommand + "," + commandSplitted[1];
		   		return aquarius::command_LEDControl(&myI2c, PH_TEMP_NAME, commandSplitted[1]);
		   	}
		   	else
		   	{
   				aquarius::outputError(PH_TEMP_NAME, BAD_PARAMS);
				return 1;
		   	}
		}
		else
		{
			aquarius::outputError(PH_TEMP_NAME, NOT_ENOUGH_PARAMS);
			return 1;
		}			
		
	}
	//Device temperature compensation
	else if(firstCommand.compare(PH_COMMAND_T) == 0)
	{
		if(commandSplitted.size() > 1)
			return aquarius::command_Temperature_Compensation(&myI2c, PH_TEMP_NAME, commandSplitted[1]);
		else
			return aquarius::command_Temperature_Compensation(&myI2c, PH_TEMP_NAME, PH_COMMAND_ARG_QUEST);
	}	
	//Factory reset
	else if(firstCommand.compare(PH_COMMAND_X) == 0)
		return aquarius::command_Factory_Reset(&myI2c, PH_TEMP_NAME);
	//Device information
	else if(firstCommand.compare(PH_COMMAND_I) == 0)
		return aquarius::command_Information(&myI2c, PH_TEMP_NAME);
    //If the command is a reading
    else if(firstCommand.compare(PH_COMMAND_R) == 0)
        return aquarius::command_Reading(&myI2c, PH_TEMP_NAME);
    //Device status
	else if(firstCommand.compare(PH_COMMAND_STATUS) == 0)
		return aquarius::command_Status(&myI2c, PH_TEMP_NAME);
	//Device sleep mode
	else if(firstCommand.compare(PH_COMMAND_SLEEP) == 0)
		return aquarius::command_Sleep(&myI2c, PH_TEMP_NAME);
	else
		aquarius::outputCommandResult(PH_TEMP_NAME, UNKNOWN_COMMAND);
	////////////////////////////********END OF COMMAND*************//////////
    
    return 1;
}



