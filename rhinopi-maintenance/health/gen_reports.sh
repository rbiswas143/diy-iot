#!/bin/sh

logs_dir=/root/scripts/health/reports
today=$(date +%Y-%m-%d)

# Clear old logs
rm -rf $logs_dir/*

# Journalctl
journalctl -b --since "1 day ago" > $logs_dir/boot.$today.log
journalctl -u net-check.service --since "1 day ago" > $logs_dir/net-check.service.$today.log
journalctl -u net-check.timer --since "1 day ago" > $logs_dir/net-check.timer.$today.log
journalctl -u serveo-tunnel.service --since "1 day ago" > $logs_dir/serveo-tunnel.$today.log
journalctl -u tunnel-restart.service --since "1 day ago" > $logs_dir/tunnel-restart.service.$today.log
journalctl -u tunnel-restart.timer --since "1 day ago" > $logs_dir/tunnel-restart.timer.$today.log
journalctl -u switch.service --since "1 day ago" > $logs_dir/switch.$today.log
journalctl -u minisurv-camera.service --since "1 day ago" > $logs_dir/minisurv-camera.$today.log
journalctl -u minisurv-update.timer --since "1 day ago" > $logs_dir/minisurv-update.timer.$today.log
journalctl -u minisurv-update.service --since "1 day ago" > $logs_dir/minisurv-update.service.$today.log
journalctl -u minisurv-mega-upload.timer --since "1 day ago" > $logs_dir/minisurv-mega-upload.timer.$today.log
journalctl -u minisurv-mega-upload.service --since "1 day ago" > $logs_dir/minisurv-mega-upload.service.$today.log
journalctl -u health-emails.timer --since "1 day ago" > $logs_dir/health-emails.timer.$today.log
journalctl -u health-emails.service --since "1 day ago" > $logs_dir/health-emails.service.$today.log

# Other logs
cp /root/mini-surv/logs/mini-surv.log $logs_dir/mini-surv.$today.log

# Metrics
df -h > $logs_dir/df.$today.metrics
echo Public IP: $(/root/scripts/pub_ip.sh) > $logs_dir/ip.$today.metrics
ip addr >> $logs_dir/ip.$today.metrics
