---
title: "Puzzle [STEG]"
description: "QR Code segments hidden in an image file."
sidebar_position: 1
tags: ["steg"]
---

*December 24, 2022*

QR Code segments hidden in an image file.

## Challenge Description

> Is the original always better? Maybe, should we check? (I’m just a poor boy, I need no sympathy,)

ZIP Password: `wgmy2022`

![image](/img/ctfs/wargamesmy2022-puzzle-01.png)

## Analysis

From initial observation, we are not really sure what information is hiding in this image since it is a stego challenge. Hence, I launch [stegsolve](https://github.com/zardus/ctf-tools/blob/master/stegsolve/install) again to look for clues.

***NOTE***: The `puzzle.jpg` is utterly big causing stegsolve out of the screen range after rendered the file.

Luckily, we can barely observe some QR code fractions scattered around on the top of `puzzle.jpg`.

![image](/img/ctfs/wargamesmy2022-puzzle-02.png)

Based on this observation, the ***FLAG*** most likely is hiding in the QR Code. Additionally, the organizers’ hint might come in handy.

We checked the [original image](https://en.wikipedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg) and found that the image size is exactly identical compared to `puzzle.jpg`.

## Solution

[Stegsolve](https://github.com/zardus/ctf-tools/blob/master/stegsolve/install) has an `Image Combiner` feature which can overlap two image files and perform various operations such as `XOR, ADD, SUB, ...`. In this situation, `SUB` gives the best output.

![image](/img/ctfs/wargamesmy2022-puzzle-03.png)

Combine each QR Code fraction together manually with [GIMP](https://www.gimp.org/). (Can’t find a way to automate the process -.-)

To install GIMP in Debian OS: `sudo apt install gimp`

-   Upload the Combined image.
-   Select `Free Select Tool`.
-   Trace every segment and combine the pieces.
-   Scan QR Code to get the ***FLAG***.

![image](/img/ctfs/wargamesmy2022-puzzle-04.png)

***FLAG***: `wgmy{3b68891a1ba20a27b9efd93f8d8c2fb0}`
