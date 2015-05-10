# SIM908 UART driver to get GPS coordinates
# No data transmission is done by this driver
# @author Jean-Philippe Fournier

import Adafruit_BBIO.UART as UART
import Adafruit_BBIO.GPIO as GPIO
import serial
import sys, getopt
import time

from subprocess import check_output
from subprocess import call

simP = "GPIO0_7"
UART.setup("UART1")

###############################################
# Function that check if any of the returned
# lines from the SIM908 constain OK
###############################################
def checkIfOK(lines):
    ok = 0
    for line in lines:
        if "OK" in line:
            ok = 1
    return ok
###############################################
# Function that writes a command and 
# waits for a response, returns the response
###############################################
def writeAndReadSIM908(dataToWrite):
    ser.write(dataToWrite + "\r")
    read = ser.readlines()
    return read
###############################################
# Function that starts the GPS by sending the two required commands
# PWR = 1 powers on and RST=0 does a cold reset
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
# Function that stops the GPS by sending PWR = 0
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
# Gets the current GPS information
###############################################
def getCurrentGPSInformation():
    print "Querying GPS module"
    datas = writeAndReadSIM908( "AT+CGPSINF=0" )
    ok = checkIfOK(datas)
    if ok == 1:
        print datas
        outputDataStringGPS(datas[1])
    else:
        print "Could not get GPS location"
    return datas
###############################################
# Inits the GPIO responsible for the control of power 
# of the entire SIM908 device
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
# Checks the state of the power P net on the SIM908
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
# Outputs the GPS data in the Aquarius common output format
##############################################
def outputDataStringGPS(data):
    splitted = data.split(",")    
    print "NAME;SIM908;DATQ;5;SATS;" + str(splitted[6]) + ";LONG;" + str(splitted[1]) + ";LAT;" + str(splitted[2]) + ";ALT;" + str(splitted[3]) + ";TIME;" + str(splitted[4])
    return
######################################################
# Does a reset of the GPS
######################################################
def resetGPS():
    datas = writeAndReadSIM908( "AT+CGPSRST=0" )
    ok = checkIfOK(datas)
    if ok == 1:
        print datas
        print "GPS resetted succesfully"
    else :
        print "GPS could not be resetted"
        
    return ok
######################################################
# Powers off the whole device
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
# Powers on the whole device
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
# Checks if the SIM908 responds to the basic command
# If it does, it is on
######################################################
def checkIfOn():
    datas = writeAndReadSIM908( "AT" )
    ok = checkIfOK(datas)
    return ok
######################################################
# Main program
# Manages the arguments passed to the script
# If the argument is an unknowm commad, it will execute it
######################################################
ser = serial.Serial( port = "/dev/ttyO1", baudrate=115200, timeout=1)

ser.close()
ser.open()

#If the serial port was opened successfully and there is arguments to manage
if ser.isOpen() and len(sys.argv) > 1:
    command = sys.argv[1]
    
    if command == "StartGPS":
        startGPS()
    elif command == "StopGPS":
        stopGPS()
    elif command == "ResetGPS":
        resetGPS()
    elif command == "PowerOff":
        powerOff()
    elif command == "PowerOn":
        powerOn()
    elif command == "R":
        getCurrentGPSInformation()
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
    #If the argument is an unknown commad, simply write the argument to the SIM908
    else :
        lines = writeAndReadSIM908(command)    
        print "Serial is open! Wrote : " + command
        i = 0
        for line in lines:
            print str(i) + " : " + line
            i = i + 1
        
else :
    print "Something went wrong with UART1 or missing arguments"
    
time.sleep(1)
ser.close()