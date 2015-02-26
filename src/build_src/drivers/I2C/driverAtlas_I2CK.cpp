#include "../../commun.h"
#include <iostream>
#include <stdlib.h>
#include "Atlas_I2C_K.h"

#define K_TEMP_NAME "K_001"
using namespace BlackLib;
using namespace std;


int main(int argc, char * argv[])
{
	string returnString;

	if (argc < 3)
	{
		cout << aquarius::Atlas_I2C::output_missingArguments() << endl;
		return 1;
	}
	string deviceLocation;
	deviceLocation.assign(argv[1]);

	vector<string> deviceLocationSplitted{ aquarius::splitArguments(deviceLocation, ':') };

	if (deviceLocationSplitted.size() < 2)
	{
		cout << "Not enough I2C location information, must be [bus:address]" << endl;
		return 1;
	}

	BlackLib::i2cName bus;

	int bus_number = atoi(deviceLocationSplitted[0].c_str());

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

	int address = atoi(deviceLocationSplitted[1].c_str());

	if (address > 255 && address <= 0)
	{
		cout << "I2C address must be smaller than 255, and higher or equal to 0" << endl;
		return 1;
	}

	BlackI2C myI2c(bus, address);
	myI2c.open(BlackLib::ReadWrite | BlackLib::NonBlock);



	string command;
	command.assign(argv[2]);
	vector<string> commandSplitted{ aquarius::splitArguments(command, ':') };
	string firstCommand = commandSplitted[0];

	aquarius::Atlas_I2C_K K(K_TEMP_NAME, &myI2c);

	int commandResult;
	string finalCommand;
	////////////////////////////********COMMAND BUILDING**********////////////////////
	//Creates i2c command
	//If command is calibration 	
	if (firstCommand.compare(I2C_COMMAND_CALIB) == 0)
	{
		//Verify that there is the minimum second argument
		if (commandSplitted.size() > 2)
		{
			return K.command_Calibration(commandSplitted[1], commandSplitted[2]);
		}
		else if (commandSplitted.size() > 1)
		{
			return K.command_Calibration(commandSplitted[1]);
		}
		else
		{
			aquarius::outputError(K_TEMP_NAME, NOT_ENOUGH_PARAMS);
			return 1;
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
				return K.command_LEDControl(commandSplitted[1]);
			}
			else
			{
				aquarius::outputError(K_TEMP_NAME, BAD_PARAMS);
				return 1;
			}
		}
		else
		{
			aquarius::outputError(K_TEMP_NAME, NOT_ENOUGH_PARAMS);
			return 1;
		}

	}
	//Device temperature compensation
	else if (firstCommand.compare(I2C_COMMAND_T) == 0)
	{
		if (commandSplitted.size() > 1)
			return K.command_Temperature_Compensation(commandSplitted[1]);
		else
			return K.command_Temperature_Compensation(I2C_COMMAND_ARG_QUEST);
	}
	//Factory reset
	else if (firstCommand.compare(I2C_COMMAND_X) == 0)
		return K.command_Factory_Reset();
	//Device information
	else if (firstCommand.compare(I2C_COMMAND_I) == 0)
		return K.command_Information();
	//If the command is a reading
	else if (firstCommand.compare(I2C_COMMAND_R) == 0)
		return K.command_Reading();
	//Device status
	else if (firstCommand.compare(I2C_COMMAND_STATUS) == 0)
		return K.command_Status();
	//Device sleep mode
	else if (firstCommand.compare(I2C_COMMAND_SLEEP) == 0)
		return K.command_Sleep();
	//Device salinity calibration
	else if (firstCommand.compare(K_COMMAND_K) == 0)
	{
		if (commandSplitted.size() > 1)
			return K.command_K_Constant(commandSplitted[1]);
		else
			aquarius::outputError(K_TEMP_NAME, NOT_ENOUGH_PARAMS);
		return 1;
	}
	//Output string configuration
	else if (firstCommand.compare(K_COMMAND_O) == 0)
	{
		if (commandSplitted.size() > 2)
			return K.command_Output_String_Config(commandSplitted[1], commandSplitted[2]);
		else
			aquarius::outputError(K_TEMP_NAME, NOT_ENOUGH_PARAMS);
		return 1;
	}
	else
		aquarius::outputCommandResult(K_TEMP_NAME, UNKNOWN_COMMAND);
	////////////////////////////********END OF COMMAND*************//////////

	return 1;
}



