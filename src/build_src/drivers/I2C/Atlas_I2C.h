/**
 * @file   Atlas_I2C_DO.h
 * @author Jean-Philippe Fournier and Jean-Pascal McGee
 * @date   Febuary 18 2015
 * @brief  Main Atlas I2C object for control of commands
 */


#include "../../commun.h"
#include <iostream>
#include <stdlib.h>     //atof
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"


//Commands that can be called for all modules
#define I2C_COMMAND_CALIB "Cal"
#define I2C_COMMAND_I "I"
#define I2C_COMMAND_L "L"
#define I2C_COMMAND_R "R"
#define I2C_COMMAND_SLEEP "Sleep"
#define I2C_COMMAND_STATUS "Status"
#define I2C_COMMAND_T "T"
#define I2C_COMMAND_X "X"

//Command delay before read data returned by I2C
#define I2C_COMMAND_CALIB_DELAY 18
#define I2C_COMMAND_R_DELAY 10
#define I2C_COMMAND_L_DELAY 3
#define I2C_COMMAND_STATUS_DELAY 3
#define I2C_COMMAND_SLEEP_DELAY 3 
#define I2C_COMMAND_I_DELAY 3
#define I2C_COMMAND_X_DELAY 3
#define I2C_COMMAND_T_DELAY 3

//Values to enable LEDs on the stamps
#define ATLAS_LED_CONTROL_ON "1"
#define ATLAS_LED_CONTROL_OFF "0"

//Command to request state of parameters
#define I2C_COMMAND_ARG_QUEST "?"
//Orders a clear on paramteres
#define I2C_CAL_CLEAR "clear"

//Passed when no value is given for calibration
#define NO_CALIBRATION_VALUE "NONE"

//Command result strings to help decode operations
#define SLEEP_MODE_ENABLED "Sleep mode was enabled"
#define STATUS_RESPONDED "Status responded successfully : "
#define INFORMATION_RESPONDED "Information responded successfully : "
#define COMPENSATION_RESPONDED "Temperature compensation at : "
#define COMPENSATION_SET_RESPONDED "Temperature now set at : "
#define FACTORY_RESET "Reset to factory settings"
#define CALIBRATION_SUCCESSFULL_P1 "Calibration successfull at : "
#define CALIBRATION_SUCCESSFULL_P2 " for point : "
#define CALIBRATION_QUERIED "Calibrated at this quantity of points :"
#define LED_SET "Leds in state : "

#define LED_ON "On"
#define LED_OFF "Off"

//Stamp output data delimiter
#define I2C_DELIMITER ","

//In namespace aquarius
namespace aquarius
{
	//Atlas I2C stamp base class
	class Atlas_I2C 
	{
		protected:
			//Contains de name of the I2C Atlas stamp device
			string deviceName_;
			//I2C port opened by the Blacklib library
			BlackI2C * i2c_;
		public:
			/***
			 * Build an Atlas I2C device 
			 * @param deviceName Name of the created device
			 * @param i2c I2C device to use
			 */
			Atlas_I2C(string deviceName, BlackI2C * i2c);
			
			/****
			 * Virtual function that calibrates the device. This function is device unique. 
			 * @param parameter Contains the calibration parameter
			 * @param value Contains the calibration value which is NO_CALIBRATION_VALUE by default
			 * @return The I2C communication result code
			 */
			virtual int command_Calibration(string parameter, string value = NO_CALIBRATION_VALUE) = 0;
			
			/***
			 * 
			 * 
			 */
			int command_Information();
			
			int command_LEDControl(string parameter);
			
			virtual int command_Reading() = 0;
			
			int command_Sleep();
			
			int command_Status();
			
			int command_Temperature_Compensation(string parameter, int silent);
			
			int command_Factory_Reset();
			
			/**
			 * @brief Output the missing arguments phrase for help
			 * @return A string that explains the minimum args for the driver to work
			 */
			static string output_missingArguments();
	};
}