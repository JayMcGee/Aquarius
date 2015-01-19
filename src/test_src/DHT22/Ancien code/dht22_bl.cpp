/**
 * @file    dht22.c
 * @author  Benoit Beaulieu
 * @date    25 août 2013
 * @brief   Fonctions utilitaires pour le capteur DHT22
 * @version 1.0 Première version inspirée de code trouvé sur le Web
 * @version 1.1 Ajout de la fonction TestDHT22 (nov 2013)
 * @version 1.2 Un peu de ménage dans le code et ajout de commentaires (01-09-14)
 * Compilateur: XC8 de Microchip
 * 
 *
 * Modification du code par : Jean-Philippe Fournier et Jean-Pascal McGee
 * Pour intégration dans le beaglebone avec Debian et Blacklib
 * Compilé sur Cloud9 avec l'aide de G++
 *
 */

#include "dht22.h"

DHT22::DHT22(BlackGPIO gpio)
{
    outputPin_ = &gpio;
    timer_ = Timing();
    temperature_ = 0;
    humidity_ = 0;
}
    
DHT22::~DHT22()
{
   
    
}

int DHT22::readDHT22()
{
    unsigned short tempH = 0, tempL = 0, humH = 0, humL = 0, check = 0;
    int retour = 0;
    
    std::cout << "Debut de la communication..." << std::endl;
    StartSignalDHT22();
    if(CheckResponseDHT22())
    {
        tempH = ReadByteDHT22();
        tempL = ReadByteDHT22();
        humH = ReadByteDHT22();
        humL = ReadByteDHT22();
        check = ReadByteDHT22();
        
        if(check == ((tempH + tempL + humH + humL) & 0x00FF))
        {
            temperature_ = ConvertToInt(tempH, tempL);
            humidity_ = ConvertToInt(humH, humL);
        }
        else
            retour = -2;
    }
    else
    {
        std::cout << "Erreur de reponse" << std::endl;
        return -1;
    }
    
}

int DHT22::getLatestTemperature()
{
    return temperature_;
}

int DHT22::getLatestHumidity()
{
    return humidity_;
}


/**
 * @brief Fonction pour initialiser une requete au DHT22
 * @param aucun
 * @return rien
 */
void DHT22::StartSignalDHT22(){
  outputPin_->setValue(high);
  usleep(250000);
  outputPin_->setValue(low);
  usleep(20000);
  outputPin_->setValue(high);
  usleep(40000);
  outputPin_->setValue(low);
}


/**
 * @brief Attend le signal de début de réponse du capteur. Soit Un 0 suivit d'un 1.
 * @param aucun
 * @return 1 si ok, 0 si pas pas de réponse
 */
unsigned short DHT22::CheckResponseDHT22(){
    //Tmr2Out_ = 0; //rst flag qui nous indique si over flow du tmr2 dans l'interruption
    //TMR2 = 0;
    //T2CONbits.TMR2ON = 1;   //start timer2
    //attend reponse du capteur ou que le temps du tmr2 soit écoule
    timer_.startMeasure(TIMER_ID_1);
    while(outputPin_->getNumericValue() == low && 
                timer_.getMeasure(TIMER_ID_1).miliSecond > 1);
                
    timer_.endMeasure(TIMER_ID_1);
    if (timer_.getMeasure(TIMER_ID_1).miliSecond > 1) return 0; //pas de réponse on sort avec une erreur
    else {
        
        timer_.startMeasure(TIMER_ID_2);
        while(outputPin_->getNumericValue() == low &&
                    timer_.getMeasure(TIMER_ID_2).miliSecond > 1); //attend front descendant ou temps écoulé
        if (timer_.getMeasure(TIMER_ID_2).miliSecond > 1) return 0; //pas de réponse on sort avec une erreur
        else {
            timer_.endMeasure(TIMER_ID_2); //stop timer2
            return 1; // retourne vrai car signal de debut de rep bien recu
        }
        

    }

}

/**
 * @brief Lecture d'un byte retourné par le DHT22
 * @param aucun
 * @return Retourne le byte lu
 */

unsigned short DHT22::ReadByteDHT22(){
  unsigned short num = 0, i;
  
  for (i=0; i<8; i++){ //on boucle pour lire les 8 bits
   while(outputPin_->getNumericValue() == low); //reste ici tant qu'on a un niveau bas
   
   timer_.startMeasure(TIMER_ID_READ);
   while(outputPin_->getNumericValue() == high); //reste ici tant que le signal est haut
   timer_.endMeasure(TIMER_ID_READ); //on arrete le tmr
   if(timer_.getMeasure(TIMER_ID_READ).microSecond > 40) num |= 1<<(7-i);  // si le temps haut a ete > 40us -> bit lu = 1. On place donc un 1 au bon endroit dans num
  }
  return num;
}


/**
 * @brief Conversions des 2 bytes reçus en un integer.
 * Exemple: Si la veleur de l'humidité est de 65.8%, on lira: hiByte = 0x02,
 * loByte = 0x92. On retournera 0x0292 (=658 en décimale)
 * @param hiByte poids fort de la valeur lue
 * @param loByte Poids faible de la valeur lue
 * @return Retourne le résultat de la conversion
 */

int DHT22::ConvertToInt(unsigned char hiByte, unsigned char loByte)
{
    int rc = 0;
    rc |= (hiByte & 0x7F);
    rc = rc<<8;
    rc |= (loByte & 0xFF);
    if(hiByte & 0x80)
    {
        rc*=-1;
    }
    return rc;
}



/**
 * @brief Conversion de la valeur lue en une chaine de caractère. Ajoute le -
 * si negatif et la partie decimale.
 * Exemple. Si data = 224, on retourne la chaine "22.4"
 * @param ptr pointeur vers la chaîne de caractères à construire
 * @param fromPos Position où mettre la valeur dans la chaîne
 * @param data La donnée à convertir et à placer dana la chaîne
 */

int DHT22::FormatToText(unsigned char* ptr, int fromPos, int data)
{
    ptr [ fromPos ] = (data<0) ? MINUS : SPACE; //met un - si le nombre est negatif
    data = (data<0)? -data : data; // remene positif si est negatif
    ptr [ fromPos+4 ] = data%10 + ZERO ; //code ascii du degit decimal
    data/=10; //on discarte la partie decimale
    //note: fromPos+3 = le point decimal
    ptr [ fromPos+2 ] = data%10 + ZERO ; //code ascii du digit unite
    data/=10; //conserve juste la dizaine
    ptr [ fromPos+1 ] = data%10 + ZERO ; //code ascii du digit dizaine

}


/**
  * @brief Utilitaire pour tester plusieurs valeur de température et humidité
  * @param  T_ByteHi Adresse du byte de poids fort de la température à lire
  * @param  T_ByteLo Adresse du byte de poids faible de la température à lire
  * @param  RH_ByteHi Adresse du byte de poids fort de l'humidité à lire
  * @param  RH_ByteLo Adresse du byte de poids faible de l'humidité à lire
  *//*

void TestDHT22(unsigned short* T_ByteHi, unsigned short* T_ByteLo, unsigned short* RH_ByteHi, unsigned short* RH_ByteLo)
{
    static int HumiTest = 0;
    static int TempTest = -400;  //-40.0oC

    TempTest +=23;  //on fait des bons de 2.3oC. Si on arrive à +40oC on recommence à -40oC
    if (TempTest >= 400 ) TempTest = -400;
    if (TempTest < 0 )
    {
        TempTest *= -1; //on ramnene dans positif pour les prochains calculs
        *T_ByteHi = (unsigned short) (TempTest >> 8);
        *T_ByteHi |= 0x80; //met bit 7 à 1 pour indiquer négatif
        *T_ByteLo = (unsigned short) (TempTest & 0xFF);
        TempTest *= -1; // et on retourne dans les negatifs
    }
    else
    {
        *T_ByteHi = (unsigned short) (TempTest >> 8);
        *T_ByteLo = (unsigned short) (TempTest & 0xFF);
    }

    HumiTest +=37;  //on fait des bons de 3.7%. Si on arrive à 100.0% on recommence
    if (HumiTest >= 1000) HumiTest = 0;
    *RH_ByteHi = (unsigned short) (HumiTest >> 8);
    *RH_ByteLo = (unsigned short) (HumiTest & 0xFF);
}*/