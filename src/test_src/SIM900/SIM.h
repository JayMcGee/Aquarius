#ifndef IMODULE_H
#define IMODULE_H

#include <iostream>
#include "../BlackLib/BlackLib.h"
#include "../BlackLib/BlackUART.h"

using namespace BlackLib;
using namespace std;

class SIM900
{
public:
    SIM900(BlackUART * port);
    ~SIM900();
    
    void getState();
private:
    BlackUART port_;

};

#endif // IMODULE_H
