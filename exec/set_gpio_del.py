import Adafruit_BBIO.GPIO as GPIO
import time
GPIO.setup("GPIO1_16", GPIO.OUT)
GPIO.output("GPIO1_16", GPIO.HIGH)
time.sleep(0.2)
GPIO.output("GPIO1_16", GPIO.LOW)
time.sleep(0.2)