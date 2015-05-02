/**
 * @file   Atlas_I2C_DO.h
 * @author Jean-Philippe Fournier
 * @date   Febuary 18 2015
 * @brief  Contains a child of Atlas_I2C with the DO particularities
 */

#include "../../commun.h"
#include <iostream>
#include <stdlib.h> 
#include <stdio.h>   
#include "../../../include/blacklib/BlackLib.h"
#include "../../../include/blacklib/BlackI2C.h"
#include "Atlas_I2C.h"

#define DO_COMMAND_P "P"
#define DO_COMMAND_S "S"
#define DO_COMMAND_O "O"

#define DO_CAL_AIR "Oxy"
#define DO_CAL_0_O "0"

#define DO_COMMAND_P_DELAY 3
#define DO_COMMAND_S_DELAY 3
#define DO_COMMAND_O_DELAY 3

#define DO_COMPENSATION_PRESSURE "Pressure compensation at : "
#define DO_COMPENSATION_SET_PRESSURE "Pressure compensation now at : "

#define DO_COMPENSATION_SALINITY "Pressure compensation at : "
#define DO_COMPENSATION_SET_SALINITY "Pressure compensation now at : "

#define DO_OUTPUT_SET_AT "Output string set with : "
#define DO_OUTPUT_IS_AT "Output string is currently at : "

//Number of data outputted by the device
#define ATLAS_DO_DATA_QTY 2
#define ATLAS_DO_DATA_1 "%"
#define ATLAS_DO_DATA_2 "DO"

namespace aquarius
{
	//Inherits a base Atlas_I2C device
	class Atlas_I2C_DO : public Atlas_I2C
	{
		public:
			//Contains the name of all datas outputted by the device
		    static const string dataName[ATLAS_DO_DATA_QTY];
		    
			Atlas_I2C_DO(string deviceName, BlackI2C * i2c)  : Atlas_I2C(deviceName,i2c){};
			
			int command_Calibration(string parameter, string value = NO_CALIBRATION_VALUE);
			
		    int command_Reading();
			
			int command_Output_String_Config(string parameter, string enable = NO_CALIBRATION_VALUE);
			
			int command_Pressure(string parameter);
			
			int command_Salinity(string parameter);			
	};
}
