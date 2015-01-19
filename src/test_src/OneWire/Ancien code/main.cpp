
#include "Beaglebone_Black/bbb_one_wire.h"

#include <iostream>

using namespace std;


int main()
{
    float temperature = 0;
    string s = "";
    
    cout << "Setting up OneWire configuration... " << endl;
    
    bbb_one_wire_setup(1, 13);
    
    cout << "Starting OneWire communication loop" << endl;
    
    while(1)
    {
        if(bbb_one_wire_DS1820_read(&temperature, &s))
        {
            cout << "Il fait : " << temperature << "C" << endl;
        }
        else
        {
            cout << "Erreur de communication";
        }
        sleep(5);
    }
    
    return 0;
}