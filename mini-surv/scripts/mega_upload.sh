#!/bin/sh
path=$1
if [ -d "$path" ]; then
	rclone move $path mega:/minisurv
else
	echo Directory "$path" does not exist
	exit 1
fi