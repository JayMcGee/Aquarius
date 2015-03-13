import sys

from Adafruit_I2C import Adafruit_I2C

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

data = i2c.readS8(0x0E)

print "The register is : " + str(data)

print "Bit at 3 : " + str(getBit(data, 3))

print "New byte with 3 at 0 : " + str(setBit(data, 3, 0))
print "New byte with 0 at 1 : " + str(setBit(data, 0, 1))

print "Setting up .. "

i2c.write8(0x0E, 28)

data = i2c.readS8(0x0E)

print "The register is now : " + str(data)

