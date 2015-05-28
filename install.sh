#!/bin/bash
apt-get update; apt-get install build-essential python-dev python-setuptools python-pip python-smbus mysql-server mysql-client phpmyadmin
echo "Include /etc/phpmyadmin/apache.conf" >> /etc/apache2/apache2.conf
cd /var/lib/cloud9/Aquarius/db
mysql -u root -p -h localhost < station_aquarius_9_mai_final.sql
echo "Installing npm packages ..."
cd /var/lib/cloud9/Aquarius/node-bootstrap
pwd
npm install 
echo "Installing Express.io ... "
npm install express.io 
echo "Installing node-schedule ... " 
npm install node-schedule 
echo "Installing execSync ... " 
npm install execSync 
echo "Installing aquarius.service to system ..."
cp /var/lib/cloud9/Aquarius/install/aquarius.service /lib/systemd/system 
cd /etc/systemd/system/multi-user.target.wants/ 
ln /lib/systemd/system/aquarius.service 
cd /var/lib/cloud9/Aquarius/src/build_src/
mkdir -p /var/lib/cloud9/Aquarius/exec
mkdir -p /var/lib/cloud9/Aquarius/src/build_src/libs
make
cd /var/lib/cloud9/Aquarius/exec/
./driverAtlasI2CDO 1:97 O:%:1
./driverAtlasI2CK 1:100 K:0.1
echo "Thy shall reboot, for thy need to reseat" 
reboot 
