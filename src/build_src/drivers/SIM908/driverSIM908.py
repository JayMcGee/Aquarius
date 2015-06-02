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
# Function that check if any of the returned
# lines from the SIM908 constain OK
###############################################
def checkIfDownload(lines):
    ok = 0
    for line in lines:
        if "DOWNLOAD" in line:
            ok = 1
    return ok
###############################################
# Function that writes a command and 
# waits for a response, returns the response
###############################################
def writeAndReadSIM908(dataToWrite):
    #print "Sending " + str(dataToWrite)
    ser.write(dataToWrite + "\r")
    read = ser.readlines()
    #print "Received " + str(read)
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

    if checkIfOK(datas) == 1:
        if checkIfFix(datas[1]) == 1:
            print datas
            outputDataStringGPS(datas[1])
        else:
            print "ERROR : Could not get GPS location"
    else:
        print "ERROR : Could not get an answer from device"
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
    if len(splitted) >= 7:
        print "NAME;SIM908;DATQ;5;SATS;" + str(splitted[6]) + ";LONG;" + str(ConvertLong(str(splitted[1]))) + ";LAT;" + str(ConvertLat(str(splitted[2]))) + ";ALT;" + str(splitted[3]) + ";TIME;" + str(splitted[4])
    else:
        print "NAME;SIM908;NODQ;ERROR_NO_DATA"
    return
##############################################
# Convert the Latitude from NMEA to Degrees Decimal
##############################################
def ConvertLat(latitude):
    degrees_lat  = float(latitude[:2])
    fraction_lat = float(latitude[2:]) / 60
    if degrees_lat > 0 : 
        DD_latitude= degrees_lat + fraction_lat  # longitude (decimal degrees)
    else :
        DD_latitude = degrees_lat - fraction_lat  # longitude (decimal degrees)
    return DD_latitude
##############################################
# Convert the Longitude from NMEA to Degrees Decimal
##############################################
def ConvertLong(longitude):
    degrees_lon  = float(longitude[:3])
    fraction_lon = float(longitude[3:]) / 60
    if degrees_lon > 0 : 
        DD_longitude = degrees_lon + fraction_lon  # longitude (decimal degrees)
    else :
        DD_longitude = degrees_lon - fraction_lon  # longitude (decimal degrees)
    return DD_longitude

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
# Checks if the device has a fix on its position
# If it doesn't, return 0 or 1 if a fix was made
######################################################
def checkIfFix(datas):
    splitted = datas.split(",")
    if len(splitted) >= 6 and splitted[5] != "0":
        ok = 1
    else:
        ok = 0
    return ok 
######################################################
# Data sending function
# Sends data to the address with the apn, user and password
######################################################
def sendJSON(address, apn, user, password, path):
    baud = "AT+IPR=115200"
    apn_sett = "AT+SAPBR=3,1,\"APN\",\"" + apn + "\""
    user_sett = "AT+SAPBR=3,1,\"USER\",\"" + user + "\""
    pwd_sett = "AT+SAPBR=3,1,\"PWD\",\"" + password + "\""
    sapbr = "AT+SAPBR=1,1"
    sapbr_close = "AT+SAPBR=0,1"
    http_io = "AT+HTTPINIT"
    cid_sett = "AT+HTTPPARA=\"CID\",1"
    url_sett = "AT+HTTPPARA=\"URL\",\"" + address + "\""
    content_sett = "AT+HTTPPARA=\"CONTENT\",application/x-www-form-urlencoded"
    

    send_post = "AT+HTTPACTION=1"
    close_conn = "AT+HTTPTERM"
    
    
    f = open(path, "r")
    data = f.read()
    
    #print "Data to send : " + str(data)
    
    http_post_para = "AT+HTTPDATA=" + str(len(data)) + ", 10000";

    configurationOk = 0
    if checkIfOK(writeAndReadSIM908(baud)):
        if checkIfOK(writeAndReadSIM908(apn_sett)):
            if checkIfOK(writeAndReadSIM908(user_sett)):
                if checkIfOK(writeAndReadSIM908(pwd_sett)):
                    if checkIfOK(writeAndReadSIM908(sapbr)):
                        configurationOk = 1
    if configurationOk == 0:
        print "ERROR ON CONFIGURATION"
        writeAndReadSIM908(sapbr_close)
        return 0

    dataTransmissionOk = 0
    if checkIfOK(writeAndReadSIM908(http_io)):
        if checkIfOK(writeAndReadSIM908(cid_sett)):
            if checkIfOK(writeAndReadSIM908(url_sett)):
                if checkIfOK(writeAndReadSIM908(content_sett)):
                    if checkIfDownload(writeAndReadSIM908(http_post_para)):
                        ser.write(data + "\r")
                        time.sleep(10)
                        ser.write(send_post + "\r")
                        time.sleep(30)
                        results = ser.readlines()
                        #print results
                        #results = writeAndReadSIM908(send_post)
                        ser.write("AT+HTTPREAD=0,10000" + "\r")
                        time.sleep(2)
                        results = ser.readlines()
                        #print results
                        for result in results:
                            if "Successfully parsed JSON" in result:
                                    dataTransmissionOk = 1
    writeAndReadSIM908(sapbr_close)
    writeAndReadSIM908(close_conn)
    if dataTransmissionOk == 0:
        print "DATA TRANSMISSION ERROR"
        return 0

    print "DATA TRANSMISSION SUCCESSFULL"

    return 1
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
    elif command == "lat":
        print ConvertLat(sys.argv[2])
    elif command == "long":
        print ConvertLong(sys.argv[2])
    elif command == "send":
        print "Sending data"
        if len(sys.argv) >= 7: 
            sendJSON(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6])
        else:
            print "Sending data could not be done, not enough arguments"
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