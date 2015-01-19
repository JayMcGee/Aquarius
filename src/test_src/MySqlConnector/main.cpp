
#define DEVICE "28-000006052315"
#include <stdlib.h>
#include <iostream>
#include <mysql_connection.h>
#include <driver.h>
#include <exception.h>
#include <resultset.h>
#include <statement.h>
#include "FileRead/OneWireDevice.h"
#include "../commun.h"

using namespace sql;
using namespace std;
using namespace aquarius;

int main(void){
    //
    char buffer[255] = {'\0'};
    string dateTime;
    
//Declaration Objet
    OneWireDevice ow(DEVICE);
    float temp;
    sql::Driver *driver;
    sql::Connection *con;
    sql::Statement *stmt;
    sql::ResultSet *res;
    
//Connection    
    driver = get_driver_instance();
    con = driver->connect("tcp://127.0.0.1:3306","root","poutine");
    
   
    if(ow.isValidPath())
    {
        cout << "Device path is valid" << endl;
        if(ow.updateTemperature())
        {
            cout << "Temperature updated " << endl;
            if(ow.getLastTemperature(&temp))
            {
                cout << "Current temperature : " << temp << endl;
            }
            else
                cout << "Could not retrieve latest temperature" << endl;
        }
        else
            cout << "Could not update temperature" << endl;
    }
    else 
        cout << "Device path is not valid";
    sleep(2);
        
    //Query
    
    stmt = con->createStatement();
    stmt->execute("USE aquariusStation;");
        
    dateTime = currentDateTime();
    cout << dateTime;
    
    sprintf(buffer, "INSERT INTO sensorData (date, water_temp) VALUES (\"%s\", \"%f\");",dateTime.c_str(),temp);
    string s;
    s.assign(buffer);
    
    cout << s << endl;
    
    stmt->execute(s); 
    
    delete stmt;
    delete con;

    return 0;
}