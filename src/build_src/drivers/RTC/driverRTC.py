import sys

import sys, getopt
from Adafruit_I2C import Adafruit_I2C
from subprocess import check_output
from subprocess import call

i2c = Adafruit_I2C(0x68)

# function that permits to get a bit in a byte at a position
def getBit (byte, position):
    
    bit = (byte >> position) & 1
    
    return bit
#////////////////////////////////////////////////////////////////

# function that permits to set a bit in a byte at a position
def setBit(byte, position, bit):

    print "Byte before : " + str(byte)

    if bit > 0:
        byte = byte | (1 << position)
    else: 
        dat = ~(1 << position)
        byte = byte & (dat)

    print "Byte after : " + str(byte)

    return byte
#////////////////////////////////////////////////////////////////

# function that sets the alarm at the 

def setAlarm( hours, minutes ):
    
    print "Hour is : " + str(hours) + " and minutes : " + str(minutes)
    
    i2c.readU8(0x0E)
    
    #Set Seconds bit
    i2c.write8(0x07, 0x01)
    
    #Set minutes bit
    get = 0x40
    i2c.write8(0x08, get)
    
    #Set hours bit
    i2c.write8(0x09, 0x80)
    
    #Set Day
    i2c.write8(0x0A, 0x80)
    
    return 
#///////////////////////////////////////////////////////////////

#function that enables the alarm bit on the RTC
def enableAlarm():
    resetFlag()
    #Set alarm enable bit
    i2c.write8(0x0E, setBit(i2c.readU8(0x0E), 0, 1))
    
    return 
#///////////////////////////////////////////////////////////////

#function that enables the alarm bit on the RTC
def disableAlarm():
    resetFlag()
    #Set alarm enable bit
    i2c.write8(0x0E, setBit(i2c.readU8(0x0E), 0, 0))
    
    return 
#///////////////////////////////////////////////////////////////

#function that resets the alarm flag
def resetFlag():
    
    #Reset alarm flag
    i2c.write8(0x0F, setBit(i2c.readU8(0x0F), 0, 0))
    
    return
#///////////////////////////////////////////////////////////////

#Set date from BBB to RTC
def setDateFromBBB():
    f = open('/sys/class/i2c-adapter/i2c-1/new_device', 'a')
    f.write("ds3231 0x68")
    f.close()
    
    call(["hwclock", "-w", "-f", "/dev/rtc1"])
    
    f = open('/sys/class/i2c-adapter/i2c-1/delete_device', 'a')
    f.write("0x68")
    f.close() 
    return 
#///////////////////////////////////////////////////////////////

#Set date from RTC to BBB
def setDateFromRTC():
    f = open('/sys/class/i2c-adapter/i2c-1/new_device', 'a')
    f.write("ds3231 0x68")
    f.close()
    
    call(["hwclock", "-s", "-f", "/dev/rtc1"])
    call(["hwclock", "-w"])
    
    f = open('/sys/class/i2c-adapter/i2c-1/delete_device', 'a')
    f.write("0x68")
    f.close()
    return 
#///////////////////////////////////////////////////////////////

#Function to set alarm minutes
def setAlarmMinutes( minutes ):
    i2c.write8(0x08, get)
    return
#///////////////////////////////////////////////////////////////

#Function to set alarm hour
def setAlarmHour( hour ):
    i2c.write8(0x09, 0x80)
    return
#///////////////////////////////////////////////////////////////

#Function to get alarm
def getTimeFrom( register ):
    
    if register == "time":
        var = i2c.readList(0x00, 7)
        print "Current time : " + str(getDayFromRegister( var[4] )) + "/" +str( getMonthFromRegister( var[5] )) + "/" + str(getYearFromRegister( var[6] )) + " " + str(getHoursFromRegister( var[2] )) + ":" +str( getMinutesFromRegister( var[1] )) + ":" +str( getSecondsFromRegister( var[0] ))
    elif register == "alarm1":
        var = i2c.readList(0x07, 4)
        
    else:
        print str(register) + " is not a valid option "
    
    return
#///////////////////////////////////////////////////////////////

#Function to get seconds from read register
def getSecondsFromRegister( byte ):
    return ((byte >> 4) * 10) + (byte & 0x0F)
#///////////////////////////////////////////////////////////////

#Function to get minutes from read register
def getMinutesFromRegister( byte ):
    return (((byte >> 4) & 0x7)* 10) + (byte & 0x0F)
#///////////////////////////////////////////////////////////////

#function to get hours from read register
def getHoursFromRegister( byte ):
    return (((byte >> 4) & 0x01) * 10) + (byte & 0x0F)
#///////////////////////////////////////////////////////////////

#function to get day from read register
def getDayFromRegister( byte ):
    return (((byte >> 4) & 0x03) * 10) + (byte & 0x0F)
#///////////////////////////////////////////////////////////////

#function to get day from read register
def getYearFromRegister( byte ):
    return ((byte >> 4) * 10) + (byte & 0x0F)
#///////////////////////////////////////////////////////////////

#function to get day from read register
def getMonthFromRegister( byte ):
    return (((byte >> 4) & 0x01) * 10) + (byte & 0x0F)
#///////////////////////////////////////////////////////////////

print 'Number of arguments:pyht', len(sys.argv), 'arguments.'
print 'Argument List:', str(sys.argv)

if len(sys.argv) > 1:
    command = sys.argv[1]
    if command == "enablealarm":
        enableAlarm()
    elif command == "resetflag":
        resetFlag()
    elif command == "disablealarm":
        disableAlarm()
    elif command == "setdate":
        setDateFromBBB()
    elif command == "getdate":
        setDateFromRTC()
    elif command == "setalarm" and len(sys.argv) > 3:
        arg2 = sys.argv[2]
        if arg2 == "-m":
            setAlarmMinutes(sys.argv[3])
        elif arg2 == "-h":
            setAlarmHour(sys.argv[3])
    elif command == "gettime":
        getTimeFrom(sys.argv[2])
 
#Read lines again
#var = i2c.readList(0x00, 19)
#print var

if False:
    call(["shutdown", "-h", "now"])