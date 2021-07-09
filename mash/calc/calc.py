# 1.0.0
import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

file = open(root + "/shell/command.data", "r") # open file in read mode
commands = file.read() # read commands
args = commands.split(" ") # save args
file.close()

newDir = ""

if (len(args) >= 2):
    if (args[1] != ""):
        error = False
        try:
            answer = eval(args[1])
        except:
            print("Invalid equation.")
            error = True

        if (not error):
            print(answer)
    else:
        print("You need to specify what you want to calculate.")
else:
    print("You need to specify what you want to calculate.")