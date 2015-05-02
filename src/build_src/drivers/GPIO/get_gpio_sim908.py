#Reads the GPIO that powers on and off the SIM908 module
# @author Jean-Philippe Fournier

import Adafruit_BBIO.GPIO as GPIO
GPIO.setup("GPIO0_7", GPIO.IN)
if GPIO.input("GPIO0_7"):
    print("HIGH")
else:
    print("LOW")