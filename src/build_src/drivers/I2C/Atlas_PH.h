#include "../../commun.h"
#include <iostream>
#include <stdlib.h>     //atof
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"

//Commands that can be called for the pH module
#define PH_COMMAND_CALIB "Cal"
#define PH_COMMAND_I "I"
#define PH_COMMAND_L "L"
#define PH_COMMAND_R "R"
#define PH_COMMAND_SLEEP "Sleep"
#define PH_COMMAND_STATUS "Status"
#define PH_COMMAND_T "T"
#define PH_COMMAND_X "X"

//Command delay before read data returned by I2C
#define PH_COMMAND_CALIB_DELAY 13
#define PH_COMMAND_R_DELAY 10
#define PH_COMMAND_L_DELAY 3
#define PH_COMMAND_STATUS_DELAY 3
#define PH_COMMAND_SLEEP_DELAY 3 
#define PH_COMMAND_I_DELAY 3
#define PH_COMMAND_X_DELAY 3
#define PH_COMMAND_T_DELAY 3

//Calibration parameters
#define PH_COMMAND_MID "mid"
#define PH_COMMAND_HIGH "high"
#define PH_COMMAND_LOW "low"
#define PH_COMMAND_CLEAR "clear"

#define PH_COMMAND_ARG_QUEST "?"

#define ATLAS_LED_CONTROL_ON "1"
#define ATLAS_LED_CONTROL_OFF "0"

#define ATLAS_PH_DATA_QTY 1
#define ATLAS_PH_DATA_1 "PH"

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
    int command_Calibration(BlackI2C * i2c, string deviceName, string parameter, string value = NO_CALIBRATION_VALUE);

    int command_Information(BlackI2C * i2c, string deviceName);
    
    int command_LEDControl(BlackI2C * i2c, string deviceName, string parameter);
    
    int command_Reading(BlackI2C * i2c, string deviceName);
    
    int command_Sleep(BlackI2C * i2c, string deviceName);
    
    int command_Status(BlackI2C * i2c, string deviceName);
    
    int command_Temperature_Compensation(BlackI2C * i2c, string deviceName, string parameter);
    
    int command_Factory_Reset(BlackI2C * i2c, string deviceName);
    
    /**
     * @brief Output the missing arguments phrase for help
     * @return A string that explains the minimum args for the driver to work
     */
    string AtlasPH_output_missingArguments();
}
