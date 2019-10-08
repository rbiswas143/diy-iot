#!/bin/sh

echo Warning! This script does not configure the mega remote

path=/root/mini-surv

# Snaps directory
mkdir -p $path/snaps

# Copy services
ln -s $path/systemd/camera/minisurv-camera.service /etc/systemd/system/minisurv-camera.service
ln -s $path/systemd/upload/minisurv-mega-upload.service /etc/systemd/system/minisurv-mega-upload.service
ln -s $path/systemd/upload/minisurv-mega-upload.timer /etc/systemd/system/minisurv-mega-upload.timer
ln -s $path/systemd/update/minisurv-update.service /etc/systemd/system/minisurv-update.service
ln -s $path/systemd/update/minisurv-update.timer /etc/systemd/system/minisurv-update.timer

# Enable services
systemctl enable --now minisurv-camera.service
systemctl enable --now minisurv-mega-upload.timer
systemctl enable --now minisurv-update.timer