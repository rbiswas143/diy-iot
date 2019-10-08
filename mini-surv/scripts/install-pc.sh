#!/bin/sh

echo Warning! This script does not configure the mega remote.

path=~/mini-surv

# Snaps directory
mkdir -p /home/rb/hdd/minisurv/snaps

# Copy services
ln -sf $path/systemd/download/minisurv-mega-download.service ~/.config/systemd/user/minisurv-mega-download.service
ln -sf $path/systemd/download/minisurv-mega-download.timer ~/.config/systemd/user/minisurv-mega-download.timer

# Enable services
systemctl --user enable --now minisurv-mega-download.timer
