// Filename: myUartProject.cpp
// Author:   Yiğit Yüce - ygtyce@gmail.com

#include <iostream>
#include <unistd.h>
#include "../BlackLib/BlackLib.h"
#include "../BlackLib/BlackI2C.h"

using namespace BlackLib;
using namespace std;

int main()
{
    BlackI2C  myI2c(BlackLib::I2C_1, 0x02);
    
    myI2c.open( BlackLib::ReadWrite | BlackLib::NonBlock);
    
    uint8_t who_am_i = myI2c.getDeviceAddress();
    
    cout << "Address : " << hex << (int)who_am_i << endl;
    
    /*uint8_t data = */
    
   // myI2C.writeByte(0x00, 0xB4);
    
   // myI2C.writeByte(0x00, 0xCC);
    
   // myI2C.writeByte(0x00, 0x44);
    
 //  
  //  myI2C.writeByte(0x00, 
    

    return 0;
}