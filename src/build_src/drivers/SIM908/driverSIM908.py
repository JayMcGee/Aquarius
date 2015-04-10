import Adafruit_BBIO.UART as UART
import serial
import sys, getopt

UART.setup("UART1")

def checkIfOK(lines):
    ok = 0
    for line in lines:
        if "OK" in line:
            ok = 1
    return ok

def writeAndReadSIM908(dataToWrite):
    ser.write(dataToWrite + "\r")
    read = ser.readlines()
    return read
###############################################
def startGPS():
    print "Starting GPS module"
    datas = writeAndReadSIM908( "AT+CGPSPWR=1" )
    ok = checkIfOK(datas)
    if ok == 1:
        print "GPS module started succesfully"
    else:
        print "GPS module could not be started"
        return ok
        
    datas = writeAndReadSIM908( "AT+CGPSRST=1" )
    ok = checkIfOK(datas)
    if ok == 1:
        print "GPS resetted succesfully"
    else :
        print "GPS could not be resetted"
        
    return ok
############################################
def stopGPS():
    print "Stopping GPS module"
    datas = writeAndReadSIM908( "AT+CGPSPWR=0" )
    ok = checkIfOK(datas)
    if ok == 1:
        print "GPS module stopped succesfully"
    else :
        print "GPS module could not be stopped"
    return ok
###############################################
def getCurrentGPSInformation():
    print "Querying GPS module"
    datas = writeAndReadSIM908( "AT+CGPSINF=0" )
    ok = checkIfOK(datas)
    if ok == 1:
        outputDataStringGPS(datas[1])
    else:
        print "Could not get GPS location"
    return datas
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
    
    print "NAME;SIM908;DATQ;5;SATS;" + str(splitted[6]) + ";LONG;" + str(splitted[1]) + ";LAT;" + str(splitted[2]) + ";ALT;" + str(splitted[3]) + ";TIME;" + str(splitted[4])
    return
####################################################
def sendDataThroughPOST(file):
    
    return
######################################################

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
    elif command == "GetGPS":
        getCurrentGPSInformation()
    else :
        lines = writeAndReadSIM908(command)    
        print "Serial is open! Wrote : " + command
        i = 0
        for line in lines:
            print str(i) + " : " + line
            i = i + 1
        
else :
    print "Ooooppps something went wrong with UART1 or missing arguments"
    
ser.close()


# Eventually, you'll want to clean up, but leave this commented for now, 
# as it doesn't work yet
#UART.cleanup()