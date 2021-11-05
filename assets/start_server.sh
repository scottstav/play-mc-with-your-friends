#/bin/bash
sudo apt update
sudo apt install openjdk-16-jdk
sudo java -Xms128M -Xmx2000M -jar /home/ubuntu/servers/minecraft/server.jar nogui
