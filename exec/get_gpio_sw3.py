import Adafruit_BBIO.GPIO as GPIO
GPIO.setup("GPIO2_13", GPIO.IN)
if GPIO.input("GPIO2_13"):
    print("HIGH")
else:
    print("LOW")