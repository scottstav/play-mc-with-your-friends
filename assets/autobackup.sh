#!/bin/sh
SERVICE='server-1-16.jar'
USERNAME='ec2-user'
MC_HOME="/home/${USERNAME}/minecraft_server/"
WORLD='world world_the_end'
BUCKET_NAME='minecraft.scotty.dance'
SERVER_NAME='minecraft'

mc_saveoff() {
    echo "The server is running... suspending saves"
    $(tmux send -t minecraft.0 "save-off" C-m)
    $(tmux send -t minecraft.0 "save-all" C-m)
    sync
    sleep 10
}

mc_saveon() {
    echo "Re-enabling saves"
    $(tmux send -t minecraft.0 "save-on" C-m)
}

if ps ax | grep -v grep | grep $SERVICE > /dev/null; then

    mc_saveoff
    backup_file="${MC_HOME}backup.tar"
    echo "Backing up minecraft world..."
    rm -f $backup_file
    echo $MC_HOME
    echo $backup_file
    echo $WORLD
    nice -n 19 tar -C $MC_HOME -cf $backup_file $WORLD

    if [[ $? -ne 0 ]]
    then
	echo "Something went wrong"
	mc_saveon
	exit 1
    else
	mc_saveon
	echo "Compressing backup..."
	nice -n 19 gzip -f $backup_file

	remote_dir="s3://${BUCKET_NAME}/servers/${SERVER_NAME}/world_backups/"
	aws s3 ls $remote_dir > /tmp/backup_listing
	if ( cat /tmp/backup_listing | grep -Fq "current.tgz" ); then
	    if (cat /tmp/backup_listing | grep -Fq "previous.tgz" ); then
		aws s3 rm "${remote_dir}previous.tgz"
	    fi
	    aws s3 mv "${remote_dir}current.tgz" "${remote_dir}previous.tgz"
	fi
	aws s3 mv "${backup_file}.gz" "${remote_dir}current.tgz"

	echo "Done."
    fi

fi
