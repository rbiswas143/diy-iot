#!/bin/sh
path=$1
if [ -d "$path" ]; then
  rclone move mega:/minisurv $path && exit 0
else
	echo Directory "$path" does not exist
	exit 1
fi