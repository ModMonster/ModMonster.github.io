# 1.0.0
import os
import winsound
from time import sleep

cls = lambda: os.system('cls') # Clear screen

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

file = open(root + "/shell/command.data", "r") # open file in read mode
commands = file.read() # read commands
args = commands.split(" ") # save args
file.close()

def ConvertTime(time):
    if (time[-1] == "d"):
        time = float(time[:-1])
        time *= 86400
    elif (time[-1] == "h"):
        time = float(time[:-1])
        time *= 3600
    elif (time[-1] == "m"):
        time = float(time[:-1])
        time *= 60
    elif (time[-1] == "s"):
        time = float(time[:-1])
    else:
        return False
    
    return time

def Time(time):
    while (time > 0):
        cls()
        print("Press enter to pause and play timer. Type exit to exit timer. \n")
        print(time)

        time -= 1
        sleep(1)

    frequency = 2500  # Set Frequency To 2500 Hertz
    duration = 1000  # Set Duration To 1000 ms == 1 second
    winsound.Beep(frequency, duration)

if (len(args) >= 2):
    if (args[1] != ""):
        dur = ConvertTime(args[1])
        if (dur):
            Time(dur)
        else:
            print("Invalid time format.")
    else:
        print("You need to specify a directory to change to.")
else:
    print("You need to specify a directory to change to.")