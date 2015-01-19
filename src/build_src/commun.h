/**
*
*/


//Standard libraries
#include <iostream>
#include <string>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

//External libraries
//#include "SuperEasyJSON\json.h"

//
//System wide constants
#define NOM_STATION "aquarius001"
#define DATE_TIME_OUTPUT "%Y/%m/%d %X"



namespace aquarius
{
	typedef float t_Temperature;
	typedef int t_PH;
	typedef int t_Conductivity;
	typedef int t_DO;
	typedef int t_Humidity;

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
	const std::string currentDateTime();

}