#!/bin/sh
SERVICE='server-1-16.jar'
if ps ax | grep -v grep | grep $SERVICE > /dev/null; then
    PLAYERSEMPTY="There are 0 of a max 10 players online"
    PLAYERSEMPTY2="There are 0 of a max of 10 players online"
    $(tmux send -t minecraft.0 "list" C-m)
    sleep 5
    STATUS=$(cat /home/ec2-user/minecraft_server/logs/latest.log | grep "There are")
    echo $STATUS
    PLAYERSLIST=$(cat /home/ec2-user/minecraft_server/logs/latest.log | grep "There are" | tail -1 | cut -f2 -d"/" | cut -f2 -d":" | awk '{$1=$1;print}')
    echo $PLAYERSLIST
    if [ "$PLAYERSLIST" = "$PLAYERSEMPTY" ] || [ "$PLAYERSLIST" = "$PLAYERSEMPTY2" ]
    then
	echo "Waiting for players to come back in 10m, otherwise shutdown"
	sleep 10m
	$(tmux send -t minecraft.0 "list" C-m)
	sleep 5

	PLAYERSLIST=$(cat /home/ec2-user/minecraft_server/logs/latest.log | grep "There are" | tail -1 | cut -f2 -d"/" | cut -f2 -d":" | awk '{$1=$1;print}')
	if [ "$PLAYERSLIST" = "$PLAYERSEMPTY" ] || [ "$PLAYERSLIST" = "$PLAYERSEMPTY2" ]
	then
	    echo "shutting down"
	    $(sudo /sbin/shutdown -P +1)
	fi
    fi
    echo "Done..."
fi
