# 1.0.0
import os
import time
import threading

cls = lambda: os.system('cls') # Clear screen

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
            print(elapsed)
            print("\n\n")

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