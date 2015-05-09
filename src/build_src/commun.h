/**
 * @file   commun.h
 * @author Jean-Philippe Fournier
 * @date   January 18 2015
 * @brief  Regroup of common functions and defines
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
#include "drivers/OneWire/OneWireDevice.h"

//
//System wide constants
#define NOM_STATION "aquarius001"
#define DATE_TIME_OUTPUT "%Y/%m/%d %X"

//I2C related read erros
#define I2C_COMMS_ERROR "I2C_COMMS_ERROR"
#define I2C_READ_BACK_OK 1
#define I2C_READ_BACK_FAIL 2
#define I2C_READ_FAIL "I2C_READ_FAIL"
#define I2C_READ_BACK_PENDING 254
#define I2C_READ_PENDING "I2C_READ_PENDING"
#define I2C_READ_BACK_NO_DATA 255
#define I2C_READ_NO_DATA "I2C_READ_NO_DATA"

//OneWire device not ready error messae
#define OW_DEVICE_NOT_READY "ONE_WIRE_DEVICE_NOT_READY"

//Driver execution parameter errors
#define NOT_ENOUGH_PARAMS "NOT_ENOUGH_PARAMS"
#define NOT_ENOUGH_SUB_PARAMS "NOT_ENOUGH_SUB_PARAMS"
#define BAD_PARAMS "BAD_PARAMS"

//Data output strings
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
	
	/**
	 * @brief Output an error message
	 * @details Outputs an error message for the given device and error name
	 * 
	 * @param deviceName Device name
	 * @param errorName Error message or name
	 */
    void outputError(string deviceName, string errorName);
    
    /**
     * @brief Output read data in common aquarius format
     * @details Outputs data in the common aquarius format to be read by the main service
     * 
     * @param deviceName Device name
     * @param dataQty Number of values to output
     * @param dataNames Name of the values to output
     * @param datas Values to output
     */
    void outputReadData(string deviceName, int dataQty, const string dataNames[], const string datas[]);
    
    /**
     * @brief Output a command result
     * @details Outputs a command execution result to be read by the main service
     * 
     * @param deviceName Device name
     * @param message Command message
     */
    void outputCommandResult(string deviceName, string message);
    
    /**
     * @brief Split read arguments
     * @details Splits read arguments from devices using a parameter to split
     * 
     * @param s Read string to split
     * @param c Character to split to
     * 
     * @return Vector containing each value that was separated by parameter c
     */
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