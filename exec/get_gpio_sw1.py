#Reads the GPIO on switch one
# @author Jean-Philippe Fournier

import Adafruit_BBIO.GPIO as GPIO
GPIO.setup("GPIO2_24", GPIO.IN)
if GPIO.input("GPIO2_24"):
    print("HIGH")
else:
    print("LOW")