#include "../../commun.h"
#include <iostream>
#include <stdlib.h>     //atof
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"

#define I2C_COMMS_ERROR "I2C_COMMS_ERROR"

#define PH_READ_BACK_OK 1
#define PH_READ_BACK_FAIL 2
#define PH_READ_BACK_PENDING 254
#define PH_READ_BACK_NO_DATA 255

//Commands that can be called for the pH module
#define PH_COMMAND_CALIB "Cal"
#define PH_COMMAND_I "I"
#define PH_COMMAND_L "L"
#define PH_COMMAND_R "R"
#define PH_COMMAND_SLEEP "Sleep"
#define PH_COMMAND_STATUS "Status"
#define PH_COMMAND_T "T"
#define PH_COMMAND_X "X"

//Calibration parameters
#define PH_COMMAND_MID "mid"
#define PH_COMMAND_HIGH "high"
#define PH_COMMAND_LOW "low"
#define PH_COMMAND_CLEAR "clear"

//Command delay before read
#define PH_COMMAND_CALIB_DELAY 13
#define PH_COMMAND_R_DELAY 10
#define PH_COMMAND_L_DELAY 3
#define PH_COMMAND_STATUS_DELAY 3
#define PH_COMMAND_SLEEP_DELAY 3 
#define PH_COMMAND_I_DELAY 3
#define PH_COMMAND_X_DELAY 3
#define PH_COMMAND_T_DELAY 3

#define PH_COMMAND_ARG_QUEST "?"

using namespace BlackLib;
using namespace std;

/**
 * @brief Function that executes a command on the i2c, waiting the delay for an answer to be put in return
 * @param i2c			I2C object that will point to the good i2c bus
 * @param commandTo     Command to send to the device
 * @param delay			Delay before looking for an answer
 * @param returnData    Pointer to the returned data buffer
 */
void i2cCommand(BlackI2C * i2c, string commandTo, int delay, string * returnData);

/**
 * @brief Output the missing arguments phrase for help
 * @return A string that explains the minimum args for the driver to work
 */
string AtlasPH_output_missingArguments();

int main(int argc, char * argv[])
{
    string returnString;
    
    if(argc < 3)
    {
        cout << AtlasPH_output_missingArguments << endl;
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
	
	int commandSuccess;
    ////////////////////////////********COMMAND BUILDING**********////////////////////
    //Creates i2c command
	//If command is calibration 	
	if(commandSplitted[0].compare(PH_COMMAND_CALIB) == 0)
	{
		//Verify that there is the minimum second argument
		if(commandSplitted.size() > 1)
		{
			string finalCommand;
			//If there is 3 arguments total, verifiy their validity (mid, high or low calibration)
			if(commandSplitted.size() > 2 && (commandSplitted[2].compare(PH_COMMAND_MID) == 0 ||
								commandSplitted[2].compare(PH_COMMAND_HIGH) == 0 ||
								commandSplitted[2].compare(PH_COMMAND_LOW) == 0))
			{
				finalCommand = (string)commandSplitted[0] + "," + commandSplitted[1] + "," + commandSplitted[2];
			}
			//If there is only 2 arguments, verify validity (clear or question mark)
			else if(commandSplitted[1].compare(PH_COMMAND_CLEAR) == 0 ||
					commandSplitted[1].compare(PH_COMMAND_ARG_QUEST) == 0)
			{
				finalCommand = (string)commandSplitted[0] + "," + commandSplitted[1];
			}
			else
			{
				//OUTPUT ERROR NOT GOOD SUB COMMAND
				return 1;
			}
			cout << "Final command : " << finalCommand << endl;
			commandSuccess = i2cCommand(&myI2c, finalCommand, PH_COMMAND_CALIB_DELAY, &returnString);
		}
		else
		{
			//OUTPUT ERROR NOT ENOUGH ARGS
			return 1;
		}
	}   
	else if(commandSplitted[0].compare(PH_COMMAND_X) == 0)
	{
		cout << "Initiating a factory reset" << endl;
		i2cCommand(&myI2c, commandSplitted[0], PH_COMMAND_X_DELAY, &returnString);
		commandSuccess = i2cCommand(&myI2c, PH_COMMAND_STATUS, PH_COMMAND_STATUS_DELAY, &returnString);
	}
	else if(commandSplitted[0].compare(PH_COMMAND_L) == 0)
	{
		if(commandSplitted.size() > 1)
		{
			
		}
		else
		{
			//OUTPUT ERROR NOT ENOUGH PARAMS
			return 1;
		}			
		//commandSuccess = i2cCommand(&myI2c, command, PH_COMMAND_R_DELAY, &returnString);
	}
	else if(commandSplitted[0].compare(PH_COMMAND_T) == 0)
	{
		if(commandSplitted.size() > 1)
		{
			
		}
		else
		{
			//OUTPUT ERROR NOT ENOUGH PARAMS
			return 1;
		}
	}	
	else if(commandSplitted[0].compare(PH_COMMAND_I) == 0)=
		commandSuccess = i2cCommand(&myI2c, commandSplitted[0], PH_COMMAND_R_DELAY, &returnString);	
    //If the command is a reading
    else if(commandSplitted[0].compare(PH_COMMAND_R) == 0)
        commandSuccess = i2cCommand(&myI2c, commandSplitted[0], PH_COMMAND_R_DELAY, &returnString);
	else if(commandSplitted[0].compare(PH_COMMAND_STATUS) == 0)
		commandSuccess = i2cCommand(&myI2c, commandSplitted[0], PH_COMMAND_STATUS_DELAY, &returnString);
	else if(commandSplitted[0].compare(PH_COMMAND_SLEEP) == 0)
		commandSuccess = i2cCommand(&myI2c, commandSplitted[0], PH_COMMAND_SLEEP_DELAY, &returnString);
	////////////////////////////********END OF COMMAND*************//////////
	
	
    ////////////////////////////********RESPONSE ANALYSIS**********////////////////////
    //Outputs designed for each commands
	if(commandSuccess == PH_READ_BACK_OK)
	{
		if(returnString.compare(I2C_COMMS_ERROR) == 0)
		{
			aquarius::outputError("PH", I2C_COMMS_ERROR);
		}
		else if(commandSplitted[0].compare(PH_COMMAND_CALIB) == 0)
		{
			cout << "Command calibration executed" << returnString << endl;
			
		}
		else if(commandSplitted[0].compare(PH_COMMAND_R) == 0)
		{
			cout << "Command succesfully executed PH = " << returnString.substr(1) << endl;
			string dataName[] = { "PH" };
			string tempPH = returnString.substr(1);
			
			float datas[] = { (float)atof(tempPH.c_str()) };
			aquarius::outputReadData("PH", 1, dataName, datas);
			return 0;
		}		
	}
	else if(commandSuccess == PH_READ_BACK_FAIL)
	{
		
	}
	else if(commandSuccess == PH_READ_BACK_PENDING)
	{
		
	}
	else if(commandSuccess == PH_READ_BACK_NO_DATA)
	{
		
	}
	else
	{
		if(returnString.compare(I2C_COMMS_ERROR) == 0)
		{
			aquarius::outputError("PH", I2C_COMMS_ERROR);
		}
	}
	
    
    
    /////////////////////////////////**************END OF RESPONSE****////////////////
	
    return 1;
}

int i2cCommand(BlackI2C * i2c, string commandTo, int delay, string * returnData)
{
    uint8_t buffer[32] = {0x00};
    
    i2c->writeLine((uint8_t*)commandTo.c_str(),commandTo.size());
    
    usleep(delay * 100000);
    
    if(i2c->readLine(buffer, sizeof(buffer)))
    {
        returnData->assign((char*)buffer);
		return (int)buffer[0];
    }
    else
    {
        (*returnData) = I2C_COMMS_ERROR;
    }
	return 0;
}

string AtlasPH_output_missingArguments()
{
	return "Missing arguments, could not execute \n\r [Executable] [bus:address] [command]";
}