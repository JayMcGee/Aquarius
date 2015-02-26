#include "../../commun.h"
#include <iostream>
#include <stdlib.h>     //atof
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

#define ATLAS_DO_DATA_QTY 2
#define ATLAS_DO_DATA_1 "%"
#define ATLAS_DO_DATA_2 "DO"

namespace aquarius
{
	class Atlas_I2C_DO : public Atlas_I2C
	{
		public:
			Atlas_I2C_DO(string deviceName, BlackI2C * i2c)  : Atlas_I2C(deviceName,i2c){};
			
			int command_Calibration(string parameter);
			
		    int command_Reading();
			
			int command_Output_String_Config(string parameter, string enable);
			
			int command_Pressure(string parameter);
			
			int command_Salinity(string parameter);			
	};
}
