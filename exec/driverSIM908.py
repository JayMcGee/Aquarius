import Adafruit_BBIO.UART as UART
import Adafruit_BBIO.GPIO as GPIO
import serial
import sys, getopt
import time
#import pyproj
from subprocess import check_output
from subprocess import call



simP = "GPIO0_7"


UART.setup("UART1")
###############################################
def checkIfOK(lines):
    ok = 0
    for line in lines:
        if "OK" in line:
            ok = 1
    return ok
###############################################
def writeAndReadSIM908(dataToWrite):
    ser.write(dataToWrite + "\r")
    read = ser.readlines()
    return read
###############################################
def writeAndGetResultSIM908(dataToWrite):
    return checkIfOK(writeAndReadSIM908(dataToWrite))
###############################################
def startGPS():
    print "Starting GPS module"
    datas = writeAndReadSIM908( "AT+CGPSPWR=1" )
    ok = checkIfOK(datas)
    #if ok == 1:
        #print "GPS module started succesfully"
    #else:
        #print "GPS module could not be started"
    return ok
        
    datas = writeAndReadSIM908( "AT+CGPSRST=0" )
    ok = checkIfOK(datas)
    #if ok == 1:
        #print "GPS resetted succesfully"
    #else :
        #print "GPS could not be resetted"
    return ok
############################################
def stopGPS():
    print "Stopping GPS module"
    datas = writeAndReadSIM908( "AT+CGPSPWR=0" )
    ok = checkIfOK(datas)
    #if ok == 1:
        #print "GPS module stopped succesfully"
    #else :
        #print "GPS module could not be stopped"
    return ok
###############################################
def getCurrentGPSInformation():
    #resetGPS()
    i = 0
    while(i < 10):
        #print "Querying GPS module"
        datas = writeAndReadSIM908( "AT+CGPSINF=0" )
        ok = checkIfOK(datas)
        if ok == 1:
            #print datas
            if outputDataStringGPS(datas[1]) == 1:
                return datas
        time.sleep(5.0)
        i = i + 1
    print "ERROR : Could not get GPS location"
    return 0
###############################################
def convertGPSInformation():
    
    return
############################################### 
def initDevice():
    f = open('/sys/class/gpio/export', 'a')
    f.write("7")
    f.close()
    
    f = open('/sys/class/gpio/gpio7/direction', 'a')
    f.write("out")
    f.close()
    
    f = open('/sys/class/gpio/gpio7/value', 'a')
    f.write("0")
    f.close()
    return 
############################################### 
def checkPLine():
    f = open('/sys/class/gpio/gpio7/direction', 'a')
    f.write("in")
    f.close()
    
    f = open('/sys/class/gpio/gpio7/value', 'r')
    d = f.read()
    f.close()
    
    f = open('/sys/class/gpio/gpio7/direction', 'a')
    f.write("out")
    f.close()
    return d
##############################################
def outputDataStringGPS(data):
  #  0,							0
#0.000000,					1 long 
#0.000000,					2 lat
#0.000000,					3 alt
#20150410145606.000,		4 time
#0,							5ttff
#0,							6 sats
#0.000000,					7
#0.000000		8
    splitted = data.split(",")
    if splitted[6] == "0" or splitted[5] == "0":
        return 0
    print "NAME;SIM908;DATQ;5;SATS;" + str(splitted[6]) + ";LONG;" + str(splitted[1]) + ";LAT;" + str(splitted[2]) + ";ALT;" + str(splitted[3]) + ";TIME;" + str(splitted[4])
    return 1
#####################################################
def checkGPS():
    print "Checking GPS status"
    datas = writeAndReadSIM908( "AT+CGPSSTATUS?" )
    ok = checkIfOK(datas)
    if ok == 1:
        print datas
        print "GPS module is fixed"
    else:
        print "GPS module is not fixed"
    return ok

def resetGPS():
    datas = writeAndReadSIM908( "AT+CGPSRST=0" )
    ok = checkIfOK(datas)
    #if ok == 1:
        #print datas
        #print "GPS resetted succesfully"
    #else :
        #print "GPS could not be resetted"
        
    return ok
####################################################
def sendDataThroughPOST(file):
    writeAndGetResultSIM908 
    return
######################################################
def powerOff():
    f = open('/sys/class/gpio/gpio7/value', 'a')
    f.write("1")
    f.close()
    time.sleep(0.7)
    f = open('/sys/class/gpio/gpio7/value', 'a')
    f.write("0")
    f.close()
    return
######################################################
def powerOn():
    f = open('/sys/class/gpio/gpio7/value', 'a')
    f.write("1")
    f.close()
    time.sleep(1.1)
    f = open('/sys/class/gpio/gpio7/value', 'a')
    f.write("0")
    f.close()
    return
######################################################
def checkIfOn():
    datas = writeAndReadSIM908( "AT" )
    ok = checkIfOK(datas)
    return ok

ser = serial.Serial( port = "/dev/ttyO1", baudrate=115200, timeout=1)

ser.close()
ser.open()

print 'Number of arguments: ', len(sys.argv), 'arguments.'
print 'Argument List:', str(sys.argv)

if ser.isOpen() and len(sys.argv) > 1:
    command = sys.argv[1]
    
    if command == "StartGPS":
        startGPS()
    elif command == "StopGPS":
        stopGPS()
    elif command == "CheckGPS":
        checkGPS()
    elif command == "ResetGPS":
        resetGPS()
    elif command == "PowerOff":
        powerOff()
    elif command == "PowerOn":
        powerOn()
    elif command == "R":
        getCurrentGPSInformation()
    elif command == "InitIPConfiguration":
        print "TODO - InitIP"
    elif command == "SendJSON":
        print "TODO - JSON"
    elif command == "initDevice":
        initDevice()
    elif command == "checkIfOn":
        time.sleep(2.0)
        d = checkIfOn()
        if d == 1:
            print "ON"
        else:
            print "OFF"
    elif command == "checkPLine":
        d = checkPLine()
        if d == 1:
            print "ON"
        else:
            print "OFF"
    else :
        lines = writeAndReadSIM908(command)    
        print "Serial is open! Wrote : " + command
        i = 0
        for line in lines:
            print str(i) + " : " + line
            i = i + 1
        
else :
    print "Ooooppps something went wrong with UART1 or missing arguments"
    
time.sleep(1)
ser.close()


# Eventually, you'll want to clean up, but leave this commented for now, 
# as it doesn't work yet
#UART.cleanup()