/**
*
*/


//Standard libraries
#include <iostream>
#include <string>
#include <vector>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

//External libraries
//#include "SuperEasyJSON\json.h"

//
//System wide constants
#define NOM_STATION "aquarius001"
#define DATE_TIME_OUTPUT "%Y/%m/%d %X"

using namespace std;

namespace aquarius
{
	typedef float t_Temperature;
	typedef float t_PH;
	typedef float t_Conductivity;
	typedef float t_DO;
	typedef float t_Humidity;

	// Data structure to pass all sensor data easily
	struct SensorData
	{
		t_PH water_ph;
		t_DO water_do;
		t_Conductivity water_conduc;
		t_Temperature water_temp;
		t_Temperature case_temp;
		t_Humidity case_humidity;
	};
	
	enum class SensorErrors
	{
	    ReadOK,
	    ReadFailed,
	    DeviceNotFound,  
	    DeviceNotReady
	};

	/*
	*	@brief Function that gives out the current systeme date and time
	*   @return Gives back a date time formatted to the system constant DATE_TIME_OUTPUT
	*/
	const string currentDateTime();
	
    void outputError(string deviceName, string errorName);
    
    void outputReadData(string deviceName, int dataQty, const string dataNames[], const float datas[]);
    
    const vector<string> splitArguments(const string& s, const char& c);

}