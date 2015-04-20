import Adafruit_BBIO.GPIO as GPIO
import time
simP = "GPIO0_7"

GPIO.setup(simP, GPIO.OUT)
GPIO.output(simP, GPIO.LOW)
time.sleep(0.7)
##GPIO.output(simP, GPIO.HIGH)
if False:
    if GPIO.input(simP):
        print("HIGH")
    else:
        print("LOW")

##GPIO.cleanup()