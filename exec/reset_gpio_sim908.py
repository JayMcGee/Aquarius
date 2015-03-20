import Adafruit_BBIO.GPIO as GPIO
import time
GPIO.setup("GPIO0_7", GPIO.OUT)
GPIO.output("GPIO0_7", GPIO.LOW)
time.sleep(0.5)
GPIO.output("GPIO0_7", GPIO.HIGH)
GPIO.cleanup()