import os
import urllib.request
import re
import pafy
import vlc

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

file = open(root + "/shell/command.data", "r") # open file in read mode
commands = file.read() # read commands
args = commands.split(" ") # save args
file.close()

# get url
if (len(args) > 1):
    args.pop(0)
    if (args[0] == "help"):
        print("yt-cmd v1.0.0")
        print("Order: (video/audio), (volume <percent>), <search term>")
        exit()

    if (args[0] == "video"):
        show_video = True
        args.pop(0)
    elif (args[0] == "audio"):
        show_video = False
        args.pop(0)
    else:
        show_video = False
    
    if (args[0] == "volume"):
        try:
            volume = int(args[1])
        except:
            print("Invalid volume specified, defaulting to 100%. Volume should be a number from 0-100.")
            volume = 100

        args.pop(0)
        args.pop(0)
    else:
        volume = 100
    
    search_keyword = "".join(args)
else:
    search_keyword = input("Enter search term > ").replace(" ", "+")

    show_video = False
    show_video_input = input("Type 'video' to show the video, or press enter for audio only. > ")
    if (show_video_input == "video"):
        show_video = True

    volume_input = input("Type the volume, as a number from 0-100, or press enter for 100% > ")
    try:
        volume = int(volume_input)
    except:
        if (volume_input != ""):
            print("Invalid volume specified, defaulting to 100%. Volume should be a number from 0-100.")
        volume = 100

html = urllib.request.urlopen("https://www.youtube.com/results?search_query=" + search_keyword)
video_ids = re.findall(r"watch\?v=(\S{11})", html.read().decode())
url = "https://www.youtube.com/watch?v=" + video_ids[0]

if (show_video):
    print("Getting video...")
else:
    print("Getting audio...")

# play video

video = pafy.new(url)

if (show_video):
    playurl = video.getbest().url
else:
    playurl = video.getbestaudio().url

instance = vlc.Instance()
player = instance.media_player_new()
media = instance.media_new(playurl)
media.get_mrl()
player.set_media(media)

player.audio_set_volume(volume)

player.play()

# output

print(f"Now playing: {video.title} from {url}")

control_input = [""]
paused = False

while (control_input[0] != "exit"):
    control_input = input("(exit/volume/return) > ").split(" ")

    if (control_input[0] != "exit"):
        if (control_input[0] == "volume"):
            try:
                new_volume = int(control_input[1])
            except:
                new_volume = -1

            if (new_volume >= 0 & new_volume <= 100):
                player.audio_set_volume(new_volume)
            else:
                print("Invalid volume. Volume should be a number from 0-100.")
        elif (paused):
            player.play()
        else:
            player.pause()

player.stop()