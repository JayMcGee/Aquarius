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
#define I2C_COMMAND_CALIB_DELAY 13
#define I2C_COMMAND_R_DELAY 10
#define I2C_COMMAND_L_DELAY 3
#define I2C_COMMAND_STATUS_DELAY 3
#define I2C_COMMAND_SLEEP_DELAY 3 
#define I2C_COMMAND_I_DELAY 3
#define I2C_COMMAND_X_DELAY 3
#define I2C_COMMAND_T_DELAY 3

#define ATLAS_LED_CONTROL_ON "1"
#define ATLAS_LED_CONTROL_OFF "0"

#define I2C_COMMAND_ARG_QUEST "?"
#define I2C_CAL_CLEAR "clear"

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

#define I2C_DELIMITER ","

namespace aquarius
{
	class Atlas_I2C 
	{
		protected:
			string deviceName_;
			BlackI2C * i2c_;
		public:
			Atlas_I2C(string deviceName, BlackI2C * i2c);
		
			virtual int command_Calibration(string parameter, string value = NO_CALIBRATION_VALUE) = 0;

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