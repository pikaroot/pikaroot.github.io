---
title: "Image Investigation [FORENSIC]"
categories: TJCTF2023
permalink: /ctfs/tjctf2023/ciphermadness
toc: true
toc_label: "cat forensics.md"
toc_icon: "terminal"
---

# Challenge 1: Beep-Boop-Robot
6 points, 558 solves

## 📁 Challenge Description
>beep boop, it sounds like a robot. sus.....
>
>the flag format is `tjctf{somewords}`, all one word, all lowercase.

[robot.wav](https://tjctf-2023-rctf.storage.googleapis.com/uploads/dc92777abc2bef4ebf4171d42bd77687fd6c53af74ccc04ee571dbb02a253a9b/robot.wav)

<audio controls>
  <source src="https://tjctf-2023-rctf.storage.googleapis.com/uploads/dc92777abc2bef4ebf4171d42bd77687fd6c53af74ccc04ee571dbb02a253a9b/robot.wav" type="audio/wav">
</audio>

## 🚩 Solution

Upload to a [Online Morse Decoder](https://morsecode.world/international/decoder/audio-decoder-adaptive.html) and get the flag.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/7aa486ee-181c-4f99-ae56-85dc2ef609b0)

Change to lowercase.

***FLAG***: `tjctf{thisisallonewordlmao}`

# Challenge 2: Nothing-To-See [EASY]
7 points, 460 solves

## 📁 Challenge Description
>nothing to see here, just move along

[nothing.png](https://tjctf-2023-rctf.storage.googleapis.com/uploads/765d3a5ba2b9a320cf76a4fd3b9a8322e0319b5dda6e65fe73d4ce9bc80a37dd/nothing.png)

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/4e38cfbd-c515-4c5e-9a9a-65fdbd6df700)

## 🚩 Solution

By running `zsteg nothing.png`, we can know every suspicious information.

```
[?] 228 bytes of extra data after image end (IEND), offset = 0x399f
extradata:0         .. file: Zip archive data, at least v2.0 to extract, compression method=deflate
    00000000: 50 4b 03 04 14 00 09 00  08 00 44 a4 b9 56 3a 0c  |PK........D..V:.|
    00000010: c4 c1 2e 00 00 00 27 00  00 00 08 00 1c 00 66 6c  |......'.......fl|
    00000020: 61 67 2e 74 78 74 55 54  09 00 03 7f fe 6f 64 80  |ag.txtUT.....od.|
    00000030: fe 6f 64 75 78 0b 00 01  04 f5 01 00 00 04 14 00  |.odux...........|
    00000040: 00 00 c2 a8 3c df e2 0a  53 0d 9e 5c e9 6f 3f ef  |....<...S..\.o?.|
    00000050: 17 f5 cd 33 32 8d 9a 1a  ee 63 17 78 d4 78 a8 b0  |...32....c.x.x..|
    00000060: 89 2d 96 12 ac 38 67 96  9a 7f c3 ed 65 9c 5a 41  |.-...8g.....e.ZA|
    00000070: 50 4b 07 08 3a 0c c4 c1  2e 00 00 00 27 00 00 00  |PK..:.......'...|
    00000080: 50 4b 01 02 1e 03 14 00  09 00 08 00 44 a4 b9 56  |PK..........D..V|
    00000090: 3a 0c c4 c1 2e 00 00 00  27 00 00 00 08 00 18 00  |:.......'.......|
    000000a0: 00 00 00 00 01 00 00 00  a4 81 00 00 00 00 66 6c  |..............fl|
    000000b0: 61 67 2e 74 78 74 55 54  05 00 03 7f fe 6f 64 75  |ag.txtUT.....odu|
    000000c0: 78 0b 00 01 04 f5 01 00  00 04 14 00 00 00 50 4b  |x.............PK|
    000000d0: 05 06 00 00 00 00 01 00  01 00 4e 00 00 00 80 00  |..........N.....|
    000000e0: 00 00 00 00                                       |....            |
meta Title          .. text: "panda_d02b3ab3"
```

From here, we know that `nothing.png` embeds a zip file contains the `flag.txt`. When we attempt to unzip the zip file, it requires a password where the `meta Title` gives it away. Hence, we can get the `flag.txt`.

```
Archive:  nothing.zip
warning [nothing.zip]:  14751 extra bytes at beginning or within zipfile
  (attempting to process anyway)
[nothing.zip] flag.txt password: 
  inflating: flag.txt
```

***FLAG***: `tjctf{the_end_is_not_the_end_4c261b91}`

# Challenge 1: Neofeudalism [EASY]
20 points, 178 solves

## 📁 Challenge Description
>One of my friends has gotten into neo-feudalism recently. He says that society should be more like a feudalist one, with unequal rights, legal protections, and wealth distribution.
>
>I found this weird photo on his computer; can you find a flag?

[image.png](https://tjctf-2023-rctf.storage.googleapis.com/uploads/12638f829bd3956e54282111f398f08b7a531ec4a5437eeb03e1ec9315236fe8/image.png)

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/b107fadf-b04d-4144-83c3-2ad1fda4db3e)

## 🚩 Solution

By running `zsteg image.png`, we did not know quite much information.

```
imagedata           .. text: "\r\r#!\"\n\n\n"
b1,bgr,lsb,xy       .. <wbStego size=112773, ext="?;\xE3", data="q\xD1U\xB4\xF0\xD3uw\xF6\xDE"..., even=false>
b3,r,lsb,xy         .. text: "+R>=\"Aa("
b3,g,msb,xy         .. text: "/^$>EN3nh"
b4,r,lsb,xy         .. text: "geeXVWwTZ"
b4,r,msb,xy         .. text: "G.fLB0jb"
b4,g,lsb,xy         .. text: "FVQ#w\"ifS"
```

`zsteg` has a `--all` flag which will list out all possible payloads (e.g., `b1,bgr,lsb,xy`) which is a lot of payloads. Hence, we can just grab the flag by using `grep` since we know the flag format.

```
zsteg image.png --all | grep 'tjctf{'

b1,r,msb,yx         .. text: "tjctf{feudalism_still_bad_ea31e43b}Soon after his succession, probably in 1058, Guiscard separated from his wife Alberada because they were related within the prohibited degrees. Shortly after, he married Sichelgaita, the sister of Gisulf II of Salerno, Gu"
```

***FLAG***: `tjctf{feudalism_still_bad_ea31e43b}`
