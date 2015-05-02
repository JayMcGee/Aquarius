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
		
			Atlas_I2C_PH(string deviceName, BlackI2C * i2c)  : Atlas_I2C(deviceName,i2c){};
			
			int command_Calibration(string parameter, string value = NO_CALIBRATION_VALUE);
			
		    int command_Reading();
			
	};
}
