---
title: "Cloud Storage V2 [WEB]"
categories: CodeCombat2023
permalink: /ctfs/codecombat2023/cloudstoragev2
---

Local File Inclusion lead to Remote Code Execution via PHP Injection.

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
The challenge presents a slightly improved security for the file upload functionality on the website. The way it validates if an image file is safe to be uploaded is incomplete and can be bypassed easily. It does check whether it is an image by looking the file signatures but it doesn't check using the file extension.

Hence, we can start by using a cute penguin image `penguin.jpeg`.

[[image]]

Using `file penguin.jpeg` to check the file type.

[[image]]

Change the file extension from `penguin.jpeg` to `penguin.php`.

[[image]]

Check the file type again. We can see that the file type remain unchanged despite the file extension has been modified.

[[image]]

Upload it to the website and check for vulnerabilities.

[[image]]

We concluded that this challenge website is vulnerable to PHP injection attack. We can inject a PHP shellcode stating the location of the flag (given by the challenge) to execute remotely and retrieve information from the website.

Now, inject a super duper simple PHP shell execution payload into the `penguin.php` using `exiftool`.

[[image]]

{% capture notice-2 %}
💡 **NOTE**: We tried to inject using `-Note=` and `-Comment=` metadata parameters but it does not give any results. However, we ended up using `-DocumentName=` for the attack and works. In our opinions, we think that any parameters will give the same results just the procedure of modifying the image file is incorrect.
{% endcapture %}

<div class="notice--info">{{ notice-2 | markdownify }}</div>

Upload the file and the flag is revealed.

[[image]]

***FLAG***: `sibersiaga{9c44f131b9d72f89d9a1c8520c42468d}`
