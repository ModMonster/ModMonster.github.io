# 1.0.0
import os
from time import sleep
import threading
import math

# Clear screen
if (os.name == "nt"):
    cls = lambda: os.system('cls')
else:
    cls = lambda: os.system('clear')

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

file = open(root + "/shell/command.data", "r") # open file in read mode
commands = file.read() # read commands
args = commands.split(" ") # save args
file.close()

command = ""
paused = False

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

def Time():
    global paused
    global command
    global dur
    while (command != "exit"):
        if (dur > 0):
            if (not paused):
                cls()
                print("Press enter to pause and play timer. Type exit to exit timer. \n")
                formattedDur = str(math.floor(dur / 3600) % 60) + ":" + str(math.floor(dur / 60) % 60).zfill(2) + ":" + str(dur % 60).replace(".0", "").zfill(2)
                print(formattedDur)

                dur -= 1
            sleep(1)
        else:
            print("\a") # beeeep!
            command = "exit"
            exit()

def WatchKeyboard():
    global command
    global paused
    while (command != "exit"):
        command = input()
        if (command == ""):
            paused = not paused

if (len(args) >= 2):
    if (args[1] != ""):
        dur = ConvertTime(args[1])
        if (dur):
            thread1 = threading.Thread(target=Time)
            thread1.start()

            thread2 = threading.Thread(target=WatchKeyboard)
            thread2.daemon = True
            thread2.start()
        else:
            print("Invalid time format.")
    else:
        print("You need to specify a directory to change to.")
else:
    print("You need to specify a directory to change to.")