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

def stopGPS():
    print "Stopping GPS module"
    datas = writeAndReadSIM908( "AT+CGPSPWR=0" )
    ok = checkIfOK(datas)
    if ok == 1:
        print "GPS module stopped succesfully"
    else :
        print "GPS module could not be stopped"
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