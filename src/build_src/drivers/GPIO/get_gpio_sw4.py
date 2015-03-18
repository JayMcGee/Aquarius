import Adafruit_BBIO.GPIO as GPIO
GPIO.setup("GPIO1_28", GPIO.IN)
if GPIO.input("GPIO1_28"):
    print("HIGH")
else:
    print("LOW")