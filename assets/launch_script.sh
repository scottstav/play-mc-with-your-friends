#!/bin/bash
tmux new-session -s minecraft -d
tmux send -t minecraft.0 "bash /home/ubuntu/servers/minecraft/start_server.sh" C-m
