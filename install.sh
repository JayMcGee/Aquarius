#!/bin/bash

echo "install npm packages"
cd /var/lib/cloud9/Aquarius/node-bootstrap
npm install 
npm install express.io
npm install node-schedule
npm install execSync

echo "installing Service"
cp /var/lib/cloud9/Aquarius/aquarius.service /lib/systemd/system
cd /etc/systemd/system/multi-user.target.wants/
ln /lib/systemd/system/aquarius.service

cd /var/lib/cloud9/Aquarius
