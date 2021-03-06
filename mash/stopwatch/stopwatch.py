# 1.1.0
import os
import time
import threading
import math

# Clear screen
if (os.name == "nt"):
    cls = lambda: os.system('cls')
else:
    cls = lambda: os.system('clear')

command = ""
elapsed = 0
paused = False

def Timer():
    global elapsed
    global command
    global paused
    while (command != "exit"):
        if (not paused):
            cls()
            print("Press enter to stop and start. Type reset to reset and exit to exit. \n")
            formattedElapsed = str(math.floor(elapsed / 3600) % 60) + ":" + str(math.floor(elapsed / 60) % 60).zfill(2) + ":" + str(elapsed % 60).zfill(2)
            print(formattedElapsed)

            elapsed += 1
        time.sleep(1)

def WatchKeyboard():
    global command
    global paused
    global elapsed
    while (command != "exit"):
        command = input()

        if (command == "reset"):
            elapsed = 0
        elif (command == ""):
            paused = not paused


thread1 = threading.Thread(target=Timer)
thread1.start()

thread2 = threading.Thread(target=WatchKeyboard)
thread2.start()
