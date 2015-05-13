import Adafruit_BBIO.ADC as ADC
 
ADC.setup()

valueRaw = ADC.read("P9_39")

value = (valueRaw * 1.8) * 8.1

print "NAME;BATS;DATQ;1;VOLT;" + str(value)