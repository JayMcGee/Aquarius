import Adafruit_BBIO.UART as UART
import serial
import sys, getopt

UART.setup("UART1")

def writeAndReadSIM908( dataToWrite ):
    
    ser.write(dataToWrite + "\r")
    
    read = ser.readlines()
    
    return read

ser = serial.Serial(port = "/dev/ttyO1", baudrate=115200, timeout=3)

ser.close()
ser.open()

print 'Number of arguments: ', len(sys.argv), 'arguments.'
print 'Argument List:', str(sys.argv)

if ser.isOpen() and len(sys.argv) > 1:
    command = sys.argv[1]
    
   # if command == "AT":
      #  print "AT"
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