#include "commun.h"
namespace aquarius
{
	const string currentDateTime() 
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
	
	void outputError(string deviceName, string errorName)
    {
        cout << "NOM:" << deviceName << ":DATQ:" << errorName << endl;
    }
    
    void outputReadData(string deviceName, int dataQty, const string dataNames[], const float datas[])
    {
        cout << "NOM:" << deviceName << ":DATQ:" << dataQty;
        
        for(int i = 0; i < dataQty; i++)
        {
            cout << ":" << dataNames[i] << ":" << datas[i];
        }
        cout << endl;
    }
    
    
    const vector<string> splitArguments(const string& s, const char& c)
    {
    	string buff{""};
    	vector<string> v;
    	
    	for(auto n:s)
    	{
    		if(n != c) buff+=n; else
    		if(n == c && buff != "") { v.push_back(buff); buff = ""; }
    	}
    	if(buff != "") v.push_back(buff);
    	
    	return v;
    }
}
