/**
*
*/


//Standard libraries
#include <iostream>
#include <string>
#include <vector>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

//External libraries
#include "../include/blacklib/BlackLib.h"
#include "../include/blacklib/BlackI2C.h"

//
//System wide constants
#define NOM_STATION "aquarius001"
#define DATE_TIME_OUTPUT "%Y/%m/%d %X"

#define I2C_COMMS_ERROR "I2C_COMMS_ERROR"

#define I2C_READ_BACK_OK 1

#define I2C_READ_BACK_FAIL 2
#define I2C_READ_FAIL "I2C_READ_FAIL"

#define I2C_READ_BACK_PENDING 254
#define I2C_READ_PENDING "I2C_READ_PENDING"

#define I2C_READ_BACK_NO_DATA 255
#define I2C_READ_NO_DATA "I2C_READ_NO_DATA"

#define NOT_ENOUGH_PARAMS "NOT_ENOUGH_PARAMS"
#define NOT_ENOUGH_SUB_PARAMS "NOT_ENOUGH_SUB_PARAMS"
#define BAD_PARAMS "BAD_PARAMS"

#define DEVICE_NAME_VAR "NAME"
#define DATA_OUTPUT_DELIMITER ";"
#define DATA_QUANTITY "DATQ"
#define NO_DATA_MESSAGE "NODQ"

#define UNKNOWN_COMMAND "Unknown command"

using namespace std;
using namespace BlackLib;

namespace aquarius
{
	/*
	*	@brief Function that gives out the current systeme date and time
	*   @return Gives back a date time formatted to the system constant DATE_TIME_OUTPUT
	*/
	const string currentDateTime();
	
    void outputError(string deviceName, string errorName);
    
    void outputReadData(string deviceName, int dataQty, const string dataNames[], const float datas[]);
    
    void outputCommandResult(string deviceName, string message);
    
    const vector<string> splitArguments(const string& s, const char& c);
    
    /**
	 * @brief Function that executes a command on the i2c, waiting the delay for an answer to be put in return
	 * @param i2c			I2C object that will point to the good i2c bus
	 * @param commandTo     Command to send to the device
	 * @param delay			Delay before looking for an answer
	 * @param returnData    Pointer to the returned data buffer
	 * @return 
	 */
	int i2cCommand(BlackI2C * i2c, string commandTo, int delay, string * returnData);

}