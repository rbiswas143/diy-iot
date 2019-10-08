import os
import sys
import time
import datetime
import logging
from logging.handlers import RotatingFileHandler
import atexit
import picamera
import math

# Parameters
camresolution = (320, 200) #(1024, 768)
mindelay = 3
maxdelay = 60  # 1 min
maxsnaps = 20000  # in SD Card
snapsdir = 'mini-surv/snaps'  # fix path
snapprefix = 'surv_'

# Config Modes
curr_mode = 'day'
mode_config = {
	'night': {
		'iso': 900,
		'shutter_speed': 100000,
		'brightness': 80,
		'contrast': 100
	},
	'day': {
		'iso': 0,
		'shutter_speed': 0,
		'brightness': 50,
		'contrast': 0
	}, 
}
mode_timings = [
	(0, (5*60)+30, 'night'),
	((5*60)+30, 19*60, 'day'),
	(19*60, 24*60, 'night')
]

# Logging
logfile = 'mini-surv/logs/mini-surv.log'  # fix path
os.makedirs(os.path.dirname(logfile), exist_ok=True)
logger = logging.getLogger("mini-surv")
logger.setLevel(logging.INFO)
handler = RotatingFileHandler(logfile, maxBytes=1024*1024, backupCount=10) # 1MB x 10 files
formatter = logging.Formatter('%(asctime)s [%(levelname)s] :: %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

logger.info('Parameter camresolution=%s', camresolution)
logger.info('Parameter mindelay=%s', mindelay)
logger.info('Parameter maxdelay=%s', maxdelay)
logger.info('Parameter maxsnaps=%s', maxsnaps)
logger.info('Parameter snapsdir=%s', snapsdir)
logger.info('Parameter snapprefix=%s', snapprefix)
logger.info('Parameter logfile=%s', logfile)

# Camera
camera = picamera.PiCamera()
atexit.register(lambda: camera.close())
camera.resolution = camresolution
time.sleep(2) # Camera warm-up time

# Utils

def get_new_snap_path():
	dt = datetime.datetime.now()
	day_dir = str(dt.date())
	return os.path.join(snapsdir, day_dir, snapprefix + str(dt.time()) + '.jpg')

def capture(fpath, delay):
	time.sleep(delay)
	camera.capture(fpath, format='jpeg')

def count_snaps():
	content = os.listdir(snapsdir)
	return len(content)

def get_old_snaps(count=1):
	content = os.listdir(snapsdir)
	content.sort()
	return list(map(lambda x: os.path.join(snapsdir, x), content[:count]))

def del_snaps(spaths):
	for path in spaths:
		os.unlink(path)

def map_snaps_to_delay(scount):
	base = 1.006
	a = (maxdelay - mindelay) / (math.pow(base, maxsnaps) - 1)
	b = mindelay - a
	return (a * math.pow(base, scount)) + b

def get_config_mode():
	mode_default = 'day'
	minute = (60 * datetime.datetime.now().time().hour) + datetime.datetime.now().time().minute
	for beg, end, mode in mode_timings:
		if beg <= minute < end:
			return mode
	return mode_default

def configure_camera():
	global curr_mode
	mode = get_config_mode()
	if mode != curr_mode:
		curr_mode = mode
		config = mode_config[mode]
		logger.info('Changing mode to: {}. Mode config: {}'.format(mode, config))
		camera.iso = config['iso']
		camera.shutter_speed = config['shutter_speed']
		camera.brightness = config['brightness']
		camera.contrast = config['contrast']
		time.sleep(10)

## Program Loop

error_count = 0
max_error_count = 1000

def start():

	logger.info('Starting program loop')

	# Create Snaps Directory
	os.makedirs(snapsdir, exist_ok=True)

	while True:

		logger.debug('New Loop')

		# Configure Camera
		try:
			configure_camera()
		except:
			logger.exception('Error configuring camera')

		# Count snaps and adjust delay
		try:
			scount = count_snaps()
			delay = map_snaps_to_delay(scount)
			logger.debug('Snaps Count : %s\tDelay : %s', scount, delay)

			# Make space for new snap
			if scount >= maxsnaps:
				dcount = scount - maxsnaps + 1
				osnaps = get_old_snaps(dcount)
				logger.info('Deleting the following %s old snap(s): %s', dcount, osnaps)
				del_snaps(osnaps)
		except:
			logger.exception('Error analyzing disc space')

		# Capture new snap
		try:
			spath = get_new_snap_path()
			os.makedirs(os.path.dirname(spath), exist_ok=True)
			logger.debug('Capturing new snap : %s', spath)
			capture(spath, delay)
		except:
			error_count += 1
			logger.exception('Error capturing snap: Error count: {}'.fomat(error_count))
			if error_count >= max_error_count:
				logger.critical('Max error count has been reached. Terminating application.')
				sys.exit(1)


if __name__ == '__main__':
	start()
