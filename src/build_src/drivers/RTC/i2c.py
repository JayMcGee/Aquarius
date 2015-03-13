import sys

from Adafruit_I2C import Adafruit_I2C
from subprocess import check_output
from subprocess import call

# function that permits to get a bit in a byte at a position
def getBit (byte, position):
    
    bit = (byte >> position) & 1
    
    return bit
#////////////////////////////////////////////////////////////////

# function that permits to set a bit in a byte at a position
def setBit(byte, position, bit):

    print "Byte before : " + str(byte)

    if bit > 0:
        byte = byte | (1 << position)
    else: 
        dat = ~(1 << position)
        byte = byte & (dat)

    print "Byte after : " + str(byte)

    return byte
#////////////////////////////////////////////////////////////////


print 'Number of arguments:', len(sys.argv), 'arguments.'
print 'Argument List:', str(sys.argv)
 
i2c = Adafruit_I2C(0x68)

#print all registers
var = i2c.readList(0x00, 19)

print var

#Reset alarm flag
i2c.write8(0x0F, setBit(i2c.readU8(0x0F), 0, 0))

#Set Seconds bit
i2c.write8(0x07, 0x01)
#Set minutes bit
get = 0x40
i2c.write8(0x08, get)
#Set hours bit
i2c.write8(0x09, 0x80)
#Set Day
i2c.write8(0x0A, 0x80)

#Set alarm enable bit
i2c.write8(0x0E, setBit(i2c.readU8(0x0E), 0, 0))

#Read lines again
var = i2c.readList(0x00, 19)

print var
call(["shutdown", "-h", "now"])