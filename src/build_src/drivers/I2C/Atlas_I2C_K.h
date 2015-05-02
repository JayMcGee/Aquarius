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
		    static const string dataName[ATLAS_K_DATA_QTY];
		
			Atlas_I2C_K(string deviceName, BlackI2C * i2c) : Atlas_I2C(deviceName, i2c){};
			
			int command_Calibration(string parameter, string value = NO_CALIBRATION_VALUE);
			
		    int command_Reading();

			int command_K_Constant(string parameter);

			int command_Output_String_Config(string parameter, string enable);
	};
}
