#!/bin/sh

## Testing
# gping1=false
# gping2=false
# gping3=false
# rping=true
# netcmd=true
# donecmd="echo connected"
# rebcmd="echo dummy reboot"
# wait_net_restart="sleep 2"
# wait_net_ping="sleep 2"
# wait_net_down="sleep 2"
# wait_disaster="sleep 2"

gping1="ping google.com -c 10"
gping2="$gping1"
gping3="$gping1"
rping="ping 192.168.1.1 -c 10"
netcmd="systemctl restart netctl-auto@wlan0.service"
donecmd="echo connected"
rebcmd="reboot"
wait_net_restart="sleep 10m"
wait_net_ping="sleep 2m"
wait_net_down="sleep 30m"
wait_disaster="sleep 2h"

# Old one liner
# $gping1 && $donecmd || { $rping && { ; $waitcmd1; { $gping2 && $donecmd || { echo "Internet is still not reachable. Restarting netctl service..."; $netcmd && { echo "netctl service has been restarted. Attempting to connect to the internet shortly..."; $waitcmd2; { $gping3 && $donecmd || { echo "Final attempt to connect to the internet has failed. Now rebooting..."; $rebcmd; }; }; } || { echo "Failed to restart the netctl service. Need to reboot..."; $rebcmd; }; }; }; } || { echo "Failed to connect to router. Rebooting..."; $rebcmd; }; }

retry=0

for (( i = 0; i < 2; i++ )); do
	# Check net access
	if $gping1; then
		$donecmd
	else
		# Check router access
		if $rping; then
			# Check net access again in a bit
			echo "Could not connect to the Internet. Retrying in a bit..."
			$wait_net_restart
			if $gping2; then
				$donecmd
			else
				# Still no net access. Restart netctl
				echo "Internet is still not reachable. Restarting netctl service..."
				if $netcmd; then
					# netctl restarted. Check net access again in a bit
					echo "netctl service has been restarted. Attempting to connect to the Internet shortly..."
					$wait_net_ping
					if $gping3; then
						$donecmd
					else
						# Still no internet, possibly net is down
						if [ $i -eq 0 ]; then
							echo "Final attempt to connect to the Internet has failed. Possibly net is down. Retrying shortly..."
							$wait_net_down
							retry=1
						else
							echo "Final attempt to connect to the Internet has failed. Rebooting now..."
							$rebcmd
						fi
					fi
				else
					# Failed to restart netctl. Need to reboot
					echo "Failed to restart netctl service. Rebooting shortly..."
					$wait_disaster
					$rebcmd
				fi
			fi
		else
			# No router access. Need to reboot
			echo "Failed to connect to router. Rebooting shortly..."
			$wait_disaster
			$rebcmd
		fi
	fi
	if [ $retry -eq 0 ]; then
		exit 0
	fi
done