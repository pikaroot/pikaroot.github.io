---
title: "out of the blue [misc]"
categories: PwnsecCTF2024
permalink: /ctfs/pwnsecctf2024/out-of-the-blue
---
Hidden flag in video frames.

## Challenge Description

![image](https://github.com/user-attachments/assets/7606b310-bf93-4bfe-babc-09ece1268bdd)

## Observation

>I played this CTF with Team M53 and got 3rd place after the CTF ended. It was overall a great game with them!

Just unzip the challenge file, we've been given a video file. 

{% include video id="1xJAEdw4lwWBzn9XUKq43TX-oygEF1O-w" provider="google-drive" %}

After playing the video in general, we observed a blue ball spawning in different positions on a black background. 

Looking closely at the blue ball, we can observe there are different shades of blue in each frame. We do not know the exact number of blue, but we know it is more than one blue.

![image](https://github.com/user-attachments/assets/274e0653-2b04-43ac-ad75-636ac0286144)

We can develop a Python script to retrieve the blue ball's RGB value. However, the annoying part is that the blue ball appears in different positions, which makes retrieving the ball's color a little complicated. 

In this case, we will first extract every video frame into PNG files. 

```python
import cv2
import os

video = "./out-of-the-blue.mp4"
output_dir = "frames"
os.makedirs(output_dir, exist_ok=True)
cap = cv2.VideoCapture(video)

if not cap.isOpened():
    print("Error: Could not open video file.")
    exit()

frame_count = 0
while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_filename = os.path.join(output_dir, f"frame_{frame_count:04d}.png")
    cv2.imwrite(frame_filename, frame)
    print(f"Saved: {frame_filename}")
    frame_count += 1

cap.release()
print(f"Total frames extracted: {frame_count}")
```

Then, we can use `stats.mode()` module from `scipy` library to find all the blue pixels in a frame. The same technique applies to other frames as well. In case you are asking, this is too troublesome, I will let Mr.GPT do the work and a few manual changes.

```python
import cv2
import numpy as np
import os
from scipy import stats
from tqdm import tqdm

def detect_blue_color_mode(image_path):
    image = cv2.imread(image_path)
    hsv_image = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    lower_blue = np.array([100, 150, 50])  # Lower bound of blue in HSV
    upper_blue = np.array([140, 255, 255])  # Upper bound of blue in HSV
    blue_mask = cv2.inRange(hsv_image, lower_blue, upper_blue)
    blue_parts = cv2.bitwise_and(image, image, mask=blue_mask)
    non_zero_pixels = blue_parts[blue_mask != 0]

    if non_zero_pixels.size > 0:
        flattened_pixels = non_zero_pixels.reshape(-1, 3)
        mode_rgb = stats.mode(flattened_pixels, axis=0)[0]  
        mode_rgb = tuple(map(int, mode_rgb))
    else:
        mode_rgb = (0, 0, 0)  # If no blue pixels found, return black

    return mode_rgb

image_dir = "frames"
image_files = [f for f in os.listdir(image_dir) if f.endswith('.png')]

if len(image_files) == 0:
    print("No PNG files were found.")
    exit()

image_files.sort()

s = set()
for i in tqdm(range(len(image_files))):
    image_path = os.path.join(image_dir, image_files[i])
    detected_mode_rgb = detect_blue_color_mode(image_path)
    s.add(detected_mode_rgb)

print(f"Total blues detected: {len(s)}")
print(f"Detected blues: {s}")
```

<script type="text/javascript" src="https://asciinema.org/a/67232asef317WhzkReEA0juZZ.js" id="asciicast-67232asef317WhzkReEA0juZZ" async="async"></script>

We found two types of blues only! 

That rings a bell that it could be a binary string where the two color codes will be `0` and `1` respectively. Once decoded, it contains the flag value.

However, we overlooked the challenge by XOR-ing each frame with the same blue together to get two images. (Random thoughts, the images kinda beautiful lol)

![image](https://github.com/user-attachments/assets/e7479737-9496-4674-82f7-1fa6f76dd761)
![image](https://github.com/user-attachments/assets/9c3556b7-a41f-482a-8d53-74847d5f437e)

## Solution

You guessed it, the script from ChatGPT. It is scary useful let's be real.

```python
import os
from detect_rgb import detect_blue_color_mode
from tqdm import tqdm
from Crypto.Util.number import long_to_bytes

image_dir = "frames"  # Replace with your directory path
image_files = [f for f in os.listdir(image_dir) if f.endswith('.png')]

image_files.sort()

color_to_binary = {
    (201, 58, 2): '1', # Change to 0 if not work 
    (165, 37, 10): '0' # Change to 1 if not work
}

binary_string = ""

for i in tqdm(range(len(image_files))):
    image_path = os.path.join(image_dir, image_files[i])
    detected_mode_rgb = detect_blue_color_mode(image_path)
    
    if detected_mode_rgb in color_to_binary:
        binary_string += color_to_binary[detected_mode_rgb]
    else:
        print(f"Image {image_files[i]} - Detected unexpected color code: {detected_mode_rgb}")

print("\nDecoded Binary:\n\n",long_to_bytes(int(binary_string,2)).decode())
```

<script type="text/javascript" src="https://asciinema.org/a/6zATGomZd2GiiKWlwokHBJFzX.js" id="asciicast-6zATGomZd2GiiKWlwokHBJFzX" async="async"></script>

*FLAG:* `PWNSEC{3xtr4ct_7he_clu3s_0ut_0f_the_b1ues}`
