import Adafruit_BBIO.ADC as ADC
 
ADC.setup()

value = ADC.read("P9_40")

print "NAME;BATS;DATQ;1;VOLT;" + str(value)