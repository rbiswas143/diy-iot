import RPi.GPIO as pins
import datetime
import time

on_hours = [[0, 6], [18, 24]]
switch_pin = 40
poll_freq = 30*60 # secs = 0.5hr
test = False

pins.setmode(pins.BOARD)
pins.setup(switch_pin, pins.OUT)

val = pins.LOW
try:
    while True:
        if test:
            poll_freq = 0.1
            val = pins.HIGH if val == pins.LOW else pins.LOW
            print('HIGH: {}'.format(val == pins.HIGH))
        else:
            val = pins.HIGH
            hour = datetime.datetime.now().time().hour
            for beg, end in on_hours:
                if beg <= hour < end:
                    val = pins.LOW
                    break
            print('Hour: {}\tHIGH: {}'.format(hour, val == pins.HIGH))

        pins.output(switch_pin, val)
        time.sleep(poll_freq)
finally:
    pins.cleanup()
