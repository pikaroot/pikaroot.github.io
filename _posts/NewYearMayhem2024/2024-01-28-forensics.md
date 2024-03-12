---
title: "New Year Mayhem 2024 [FORENSICS]"
categories: NewYearMayhem2024
permalink: /ctfs/newyearmayhem2024/forensics
---
3 Forensics Challenges: 2 PCAPS, 1 Memory Dump.

# Challenge 1: Charter [EASY]
150 points

## 📁 Challenge Description

>The attackers deleted all our files in a recent breach. We managed to recover almost all of them from offsite backups but are missing some important files that were stored on the compromised file server. We managed to capture the traffic during the attack. Can you please help us with this situation and recover our files?
>
>File(s): `charter.zip`

## 🚩 Solution

Extract the ZIP file, we had been given a `.pcapng` file. This challenge actually can be solved by `strings`. The network traffic contains a great number of HTML files, but the flag is hidden inside the PCAP file itself.

```
$ strings traffic.pcapng | grep "HTB{"
an class="c12">&nbsp;</span><span class="c4">2021 All rights reserved. HTB{r3cov3ry_1s_fun_409df1!!}</span></p></div></body></html>
```

# Challenge 2: Penetrated [MEDIUM]
250 points

## 📁 Challenge Description

>We detected a strange file in the WordPress uploads folder. Luckily we still have a dump of the network traffic at the same time as the file timestamp. We wonder if it was created by the attacker and did he succeed in his goal?
>
>File(s): `penetrated.zip` 

## 🚩 Solution

Extract the ZIP file, we had been given another `.pcap` file. I called this challenge a "hidden in plain sight" challenge because it covers how attackers send malicious data via legitimate protocols through the network. I have done a [similar challenge](https://pikaroot.github.io/ctfs/codecombat2023/nightshiftendssoon), just this challenge is using `ICMP` protocol instead of `DNS`.

Inspecting the Protocol Hierarchy, `ICMP` packets have over 98.9% of packets.

Following `TCP Stream 8`, we can see a full action of how the attacker encapsulates the hidden file.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/9d754b54-4829-47df-837e-bc413298d353)

Here are 2 important things that need to be recorded:
1. The file we need to find is a `.zip` file.
2. The password of the `.zip` file is `Im4H4ck3rL0rd`.

Filter the `ICMP` packets, we can see a suspicious header `PK` which is a `.zip` file header. 

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/303c060d-ebca-4ca8-b397-18ed9dae7910)

The third and fourth packet indicates the `ConfidentialReport.pdf`, which is the file we need to find.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/9c04039d-22e8-4438-9f54-3002914a14e5)

Therefore, we just need to gather every hex chunk in each `ICMP` packet and piece them together, then obtaining the flag will be trivial.

```
$ tshark -r capture.pcap -Y "icmp && ip.src == 192.168.127.131" -T fields -e data | tr -d "\r\n" | xxd -r -p > ConfidentialReport.zip

$ file ConfidentialReport.zip
ConfidentialReport.zip: Zip archive data, at least v2.0 to extract, compression method=deflate
```

Unzip the file with the password that we found earlier.

```
$ unzip ConfidentialReport.zip 
Archive:  ConfidentialReport.zip
[ConfidentialReport.zip] ConfidentialReport.pdf password: 
  inflating: ConfidentialReport.pdf

$ open ConfidentialReport.pdf
```

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/273da095-f597-4e82-b040-d18743aa0c89)

# Challenge 3: Infected [HARD]
450 points

## 📁 Challenge Description

>After a very stressful day at work, after answering thousands of emails, I noticed something bizarre on my computer. During booting, a black window appeared for a second, and something probably locked all my files. I am not sure what happened, but all my files now have the extension .enc. After talking with the IT department, we captured my computer's memory shortly after the incident. Can you analyze the capture and recover my file?
>
>File(s): `forensic_infected.zip`

## 🚩 Solution

