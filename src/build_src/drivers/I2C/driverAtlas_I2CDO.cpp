/**
 * @file   driverAtlas_I2CDO.cpp
 * @author Jean-Philippe Fournier
 * @date   Febuary 18 2015
 * @brief  Main driver executable for the Atlas I2C DO stamp
 */

#include "../../commun.h"
#include <iostream>
#include <stdlib.h>
#include "Atlas_I2C_DO.h"
#include "../OneWire/OneWireDevice.h"

//Used to output data, designates the device in question, should be replaced by an argument
#define DO_TEMP_NAME "DO_001"

using namespace BlackLib;
using namespace std;

//Function to get water temperature from onewire device and compensate on the reading
float getWaterTemperature(string owname);

int main(int argc, char * argv[])
{
	//If not enough arguments are passed to the executable, output missing argument message
	if (argc < 3)
	{
		cout << aquarius::Atlas_I2C::output_missingArguments() << endl;
		return 1;
	}

	//Used to store the location part of the arguments
	string deviceLocation;
	//Assign to the string the supposed device location argument and split to the ':' to get all arguments
	deviceLocation.assign(argv[1]);
	vector<string> deviceLocationSplitted{ aquarius::splitArguments(deviceLocation, ':') };

	//If the device location arguments seem to be enough
	if (deviceLocationSplitted.size() < 2)
	{
		cout << "Not enough I2C location information, must be [bus:address]" << endl;
		return 1;
	}

	//Declaration of the I2C bus object
	BlackLib::i2cName bus;

	//Get the bus number from the splitted arguments
	int bus_number = atoi(deviceLocationSplitted[0].c_str());

	//Get the bus number in format usable for the device object
	if (bus_number == 0)
	{
		bus = BlackLib::I2C_0;
	}
	else if (bus_number == 1)
	{
		bus = BlackLib::I2C_1;
	}
	else
	{
		cout << "I2C bus can be 0 or 1" << endl;
		return 1;
	}

	//Get the address of the device on the bus
	int address = atoi(deviceLocationSplitted[1].c_str());
	//Check if its valid
	if (address > 255 && address <= 0)
	{
		cout << "I2C address must be smaller than 255, and higher or equal to 0" << endl;
		return 1;
	}

	//Declare an i2c device and open the bus for communications
	BlackI2C myI2c(bus, address);
	myI2c.open(BlackLib::ReadWrite | BlackLib::NonBlock);

	//string that will contain the command given to the I2C device
	string command;
	command.assign(argv[2]);
	//Splitted to get all parts
	vector<string> commandSplitted{ aquarius::splitArguments(command, ':') };
	//The command itself without any parameters
	string firstCommand = commandSplitted[0];

	//Declare de the device 
	aquarius::Atlas_I2C_DO DO(DO_TEMP_NAME, &myI2c);

	int commandResult;
	string finalCommand;
	////////////////////////////********COMMAND BUILDING**********////////////////////
	//Creates i2c command
	//If command is calibration 	
	if (firstCommand.compare(I2C_COMMAND_CALIB) == 0)
	{
		//Verify that there is the minimum second argument
		if (commandSplitted.size() > 1 )
		{
			return DO.command_Calibration(commandSplitted[1]);
		}
	}
	//Device LED control
	else if (firstCommand.compare(I2C_COMMAND_L) == 0)
	{
		if (commandSplitted.size() > 1)
		{
			if (commandSplitted[1].compare(ATLAS_LED_CONTROL_ON) ||
				commandSplitted[1].compare(ATLAS_LED_CONTROL_OFF) ||
				commandSplitted[1].compare(I2C_COMMAND_ARG_QUEST))
			{
				finalCommand = (string)firstCommand + "," + commandSplitted[1];
				return DO.command_LEDControl(commandSplitted[1]);
			}
			else
			{
				aquarius::outputError(DO_TEMP_NAME, BAD_PARAMS);
				return 1;
			}
		}
		else
		{
			aquarius::outputError(DO_TEMP_NAME, NOT_ENOUGH_PARAMS);
			return 1;
		}

	}
	//Device temperature compensation
	else if (firstCommand.compare(I2C_COMMAND_T) == 0)
	{
		if (commandSplitted.size() > 1)
			return DO.command_Temperature_Compensation(commandSplitted[1], 0);
		else
			return DO.command_Temperature_Compensation(I2C_COMMAND_ARG_QUEST, 0);
	}
	//Factory reset
	else if (firstCommand.compare(I2C_COMMAND_X) == 0)
		return DO.command_Factory_Reset();
	//Device information
	else if (firstCommand.compare(I2C_COMMAND_I) == 0)
		return DO.command_Information();
	//If the command is a reading
	else if (firstCommand.compare(I2C_COMMAND_R) == 0)
	{	
		//If temperature compensation is asked by the reading command, execute compensation before reading
    	if(commandSplitted[1].compare("-t") == 0 && commandSplitted.size() > 2)
    	{
    		float compensation = getWaterTemperature(commandSplitted[2]);
    		//If the one wire device did not cooperate
    		if(compensation == 125){
    		    aquarius::outputError(DO_TEMP_NAME, OW_DEVICE_NOT_READY);
    		    return 1;
    		}
    		else{
    		    DO.command_Temperature_Compensation(to_string(compensation), 1);
    		}
    		return DO.command_Reading();
    	}
    	//If not just read device
		return DO.command_Reading();
	}
	//Device status
	else if (firstCommand.compare(I2C_COMMAND_STATUS) == 0)
		return DO.command_Status();
	//Device sleep mode
	else if (firstCommand.compare(I2C_COMMAND_SLEEP) == 0)
		return DO.command_Sleep();
	//Device pressure calibration
	else if (firstCommand.compare(DO_COMMAND_P) == 0)
	{
		if (commandSplitted.size() > 1)
			return DO.command_Pressure(commandSplitted[1]);
		else
			aquarius::outputError(DO_TEMP_NAME, NOT_ENOUGH_PARAMS);
		return 1;
	}
	//Device salinity calibration
	else if (firstCommand.compare(DO_COMMAND_S) == 0)
	{
		if (commandSplitted.size() > 1)
			return DO.command_Salinity(commandSplitted[1]);
		else
			aquarius::outputError(DO_TEMP_NAME, NOT_ENOUGH_PARAMS);
		return 1;
	}
	//Output string configuration
	else if (firstCommand.compare(DO_COMMAND_O) == 0)
	{
		if (commandSplitted.size() > 2)
			return DO.command_Output_String_Config(commandSplitted[1], commandSplitted[2]);
		else if (commandSplitted.size() > 1)
		    return DO.command_Output_String_Config(commandSplitted[1]);
		else
			aquarius::outputError(DO_TEMP_NAME, NOT_ENOUGH_PARAMS);
		return 1;
	}		
	else
		aquarius::outputCommandResult(DO_TEMP_NAME, UNKNOWN_COMMAND);
	////////////////////////////********END OF COMMAND*************//////////

	return 1;
}

float getWaterTemperature(string owname)
{
	//Create the One Wire device object
    aquarius::OneWireDevice ow(owname);
    
    float temp;
    
    //Path validation...
    if(ow.isValidPath())
    {
        //Device path is valid
        if(ow.updateTemperature())
        {
            //Temperature updated
            if(ow.getLastTemperature(&temp))
            {
                if(temp == 85.0f)
                {
                    return 125;
                }
                else
                {
                    return temp;
                }
				
            }
        }
    }
}

