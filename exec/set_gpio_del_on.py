import Adafruit_BBIO.GPIO as GPIO
import time
GPIO.setup("GPIO1_16", GPIO.OUT)
while 1 :
    GPIO.output("GPIO1_16", GPIO.HIGH)