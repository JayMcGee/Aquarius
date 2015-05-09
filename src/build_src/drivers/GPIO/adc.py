# Reads and output current ADC value in common Aquarius output
# @author Jean-Philippe Fournier and Jean-Pascal McGee

import Adafruit_BBIO.ADC as ADC
 
ADC.setup()

value = ADC.read("P9_40")

print "NAME;BATS;DATQ;1;VOLT;" + str(value)