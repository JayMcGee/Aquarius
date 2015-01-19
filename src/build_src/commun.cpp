#include "commun.h"
namespace aquarius
{
	const std::string currentDateTime() 
	{
		time_t     now = time(0);
		struct tm  tstruct;
		char       buf[80];
		tstruct = *localtime(&now);
		// Visit http://en.cppreference.com/w/cpp/chrono/c/strftime
		// for more information about date/time format
		strftime(buf, sizeof(buf), DATE_TIME_OUTPUT, &tstruct);

		return buf;
	}	 
}
