/* 
 * @file   dht22.h
 * @Author Benoit Beaulieu
 * @date 25 août 2013
 * @brief Note: Les fonctions utilisent les intr du timer 2 pour les accès aux DHT22
 * On doit donc le configurer comme suit:
 * PIE1bits.TMR2IE = 1;  // Enable Timer2 interrupt
 * T2CON = 1;        // Prescaler 1:4 (avec un osc de 16MHz) and Timer2 est arrete au depart
 * PIR1bits.TMR2IF = 0;   // Clear TMR INT Flag bit
 * TMR2 = 0;
 * Mettre ce code dans la routine d'initialisation du pic
 *
 * Modification du code par : Jean-Philippe Fournier et Jean-Pascal McGee
 * Pour intégration dans le beaglebone avec Debian et Blacklib
 * Compilé sur Cloud9 avec l'aide de G++
 *
 */

#ifndef DHT22_H
#define	DHT22_H

#define MINUS 0x2D
#define SPACE 0x20
#define ZERO 0x30

#define TIMER_ID_1 "TIMER_ID_1"
#define TIMER_ID_2 "TIMER_ID_2"
#define TIMER_ID_READ "TIMER_ID_READ"

#include "../BlackLib/BlackCore.h"
#include "../BlackLib/BlackGPIO.h"
#include "../BlackLib/Timing.h"

#include <iostream>
#include <unistd.h>
#include <string>

using namespace BlackLib;


class DHT22
{
    private:
    
        BlackGPIO* outputPin_;
        Timing timer_;
        
        int temperature_;
        int humidity_;
        
        void StartSignalDHT22(void);
        
        unsigned short CheckResponseDHT22(void);
        
        unsigned short ReadByteDHT22(void);
        
        int ConvertToInt(unsigned char hiByte, unsigned char loByte);
        
        int FormatToText(unsigned char* ptr, int fromPos, int data);
    
    public:
    
        DHT22(BlackGPIO gpio);
    
        ~DHT22();
    
        int readDHT22();
        
        int getLatestTemperature();
        
        int getLatestHumidity();
    
};



//void TestDHT22(unsigned short* T_ByteHi, unsigned short* T_ByteLo, unsigned short* RH_ByteHi, unsigned short* RH_ByteLo);



#endif	/* DHT22_H */


