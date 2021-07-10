# 1.0.0
import os

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

file = open(root + "/shell/command.data", "r") # open file in read mode
commands = file.read() # read commands
args = commands.split(" ") # save args
file = open(root + "/shell/dir.data", "r") # open file in read mode
dir = file.read() # read dir
file.close() # close file

newDir = ""

def CalculateDirSize(dir):
    totalSize = 0
    for file in os.listdir(dir):
        if (os.path.isdir(dir + "/" + file)):
            totalSize += CalculateDirSize(dir + "/" + file)
        else:
            totalSize += os.path.getsize(dir + "/" + file)
    return totalSize

def ConvertSize(size):
    if (size >= 1000000000):
        return str((size / 1000000000)) + " GB"
    elif (size >= 1000000):
        return str((size / 1000000)) + " MB"
    elif (size >= 1000):
        return str((size / 1000)) + " KB"
    else:
        return str(size) + " B"

if (len(args) >= 2):
    if (args[1] != ""):
        # remove last "/"
        if ((args[1][-1] == "/") & (args[1][0] != "/")):
            args[1] = args[1][:-1]

        # should be absolute?
        if (args[1][0] == "/"):
            newDir = args[1]
        else:
            # in root?
            if (dir == "/"):
                newDir = dir + args[1]
            else:
                newDir = dir + "/" + args[1]

        # dot fixes
        newDir = os.path.abspath(root + newDir) # get rid of ..
        newDir = newDir.replace(root, "", 1) # remove root path
        newDir = newDir.replace("\\", "/") # replace \ with /

        # fix "nodir"
        if (newDir == ""):
            newDir = "/"

        if (os.path.isfile(root + newDir)):
            size = os.path.getsize(root + newDir) # get size 
            print(ConvertSize(size)) # print size
        else:
            if (os.path.isdir(root + newDir)):
                print(ConvertSize(CalculateDirSize(root + newDir)))
            else:
                print("Specified path doesn't exist.")
    else:
        print("You need to specify a file or directory to list the size of.")
else:
    print("You need to specify a file or directory to list the size of")
