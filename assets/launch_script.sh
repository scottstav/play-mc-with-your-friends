#!/bin/bash
tmux new-session -s minecraft -d
tmux send -t minecraft.0 "bash /home/ec2-user/minecraft_server/start_server.sh" C-m
