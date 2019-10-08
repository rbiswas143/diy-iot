import os
import atexit
import picamera
import math
import itertools

save_dir = 'temp/snaps'

camera = picamera.PiCamera()
atexit.register(lambda: camera.close())
camera.resolution = camresolution
time.sleep(2) # Camera warm-up time

brightnesses = list(range(0, 101, 20))
contrasts = list(range(-100, 101, 40))
resolutions = [ (300, 300), (1200, 1200)]
# exposure_modes = list(picamera.PiCamera.EXPOSURE_MODES.keys())
shutter_speeds = [math.pow(10, x) for x in range(4, 8)]
isos = list(range(0, 1600, 300))
settings = itertools.product(brightnesses, contrasts, resolutions, shutter_speeds, isos)

for i, setting in enumerate(settings):
	print('Saving setting {} of {}: {}'.format())

	brightness, contrast, resolution, shutter_speed, iso = setting
	camera.brightness = brightness
	camera.contrast = contrast
	camera.resolution = resolution
	# camera.exposure_mode = exposure_mode
	camera.shutter_speed = shutter_speed
	camera.iso = iso
	file_name = 'bright{}_cont{}_res{}_shut{}_iso{}.jpg'.format(*setting)
	camera.capture(os.path.join(save_dir, ), format='jpeg')
	time.sleep(int(shutter_speed / 1000000) + 1)