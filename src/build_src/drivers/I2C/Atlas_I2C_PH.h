/**
 * @file   Atlas_I2C_PH.h
 * @author Jean-Philippe Fournier and Jean-Pascal McGee
 * @date   Febuary 18 2015
 * @brief  Function calls to Atlas I2C PH stamp
 */

#include "../../commun.h"
#include <iostream>
#include <stdlib.h>     //atof
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"
#include "Atlas_I2C.h"

//Calibration parameters
#define PH_COMMAND_MID "mid"
#define PH_COMMAND_HIGH "high"
#define PH_COMMAND_LOW "low"


#define ATLAS_PH_DATA_QTY 1
#define ATLAS_PH_DATA_1 "PH"

namespace aquarius
{
	class Atlas_I2C_PH : public Atlas_I2C
	{
		public:
		    static const string dataName[ATLAS_PH_DATA_QTY];
			
			/**
			 * @brief Main constructor
			 * @details Builds the object using the parents constructor
			 * 
			 * @param deviceName Device name
			 * @param i2c I2C device to use
			 */
			Atlas_I2C_PH(string deviceName, BlackI2C * i2c)  : Atlas_I2C(deviceName,i2c){};
			
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
			
	};
}
