/**
 * @file   Atlas_I2C_K.h
 * @author Jean-Philippe Fournier and Jean-Pascal McGee
 * @date   Febuary 18 2015
 * @brief  Function calls to Atlas I2C K stamp
 */


#include "../../commun.h"
#include <iostream>
#include <stdlib.h>     //atof
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"
#include "Atlas_I2C.h"

//Calibration parameters
#define K_COMMAND_O "O"
#define K_COMMAND_K "K"

#define K_COMMAND_O_DELAY 3
#define K_COMMAND_K_DELAY 3

#define K_CAL_DRY "dry"
#define K_CAL_ONE "one"
#define K_CAL_LOW "low"
#define K_CAL_HIGH "high"

#define K_CONSTANT_SET "Set new constant to : "
#define K_CONSTANT_AT "Currently at K constant : "

#define K_OUTPUT_SET_AT "Output string set with : "
#define K_OUTPUT_IS_AT "Output string is currently at : "

#define ATLAS_K_DATA_QTY 4
#define ATLAS_K_DATA_1 "EC"
#define ATLAS_K_DATA_2 "TDS"
#define ATLAS_K_DATA_3 "SAL"
#define ATLAS_K_DATA_4 "SG"

namespace aquarius
{
	class Atlas_I2C_K : public Atlas_I2C
	{
		public:
			//Contains data names
		    static const string dataName[ATLAS_K_DATA_QTY];
		
			/**
			 * @brief Main constructor
			 * @details Builds the object using the parents constructor
			 * 
			 * @param deviceName Device name
			 * @param i2c I2C device to use
			 */
			Atlas_I2C_K(string deviceName, BlackI2C * i2c) : Atlas_I2C(deviceName, i2c){};
			
			/**
			 * @brief Device calibration
			 * @details Calibrates the device using the stamp commands
			 * 
			 * @param parameter calibration parameter
			 * @param value calibration value if any
			 * 
			 * @return I2C command result code
			 */
			int command_Calibration(string parameter, string value = NO_CALIBRATION_VALUE);
			
			/**
			 * @brief Reads the sensor value
			 * @details Outputs a reading using the common aquarius output system
			 * @return I2C command result code
			 */
		    int command_Reading();

		    /**
		     * @brief Update K constant
		     * @details Set or get the K constant (fresh water, mid, or salt water)
		     * 
		     * @param parameter Parameter or query
		     * @return I2C command result code
		     */
			int command_K_Constant(string parameter);

			/**
			 * @brief Update output string parameters
			 * @details Set or get the activated output parameters
			 * 
			 * @param parameter The parameter to query or set
			 * @param enable Enable/disable parameter
			 * 
			 * @return I2C command result code
			 */
			int command_Output_String_Config(string parameter, string enable);
	};
}
