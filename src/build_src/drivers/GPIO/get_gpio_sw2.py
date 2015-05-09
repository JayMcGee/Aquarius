#Reads the GPIO on switch 2
# @author Jean-Philippe Fournier

import Adafruit_BBIO.GPIO as GPIO
GPIO.setup("GPIO2_25", GPIO.IN)
if GPIO.input("GPIO2_25"):
    print("HIGH")
else:
    print("LOW")