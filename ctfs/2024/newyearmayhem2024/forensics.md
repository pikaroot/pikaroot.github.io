---
title: "New Year Mayhem 2024 [FORENSIC]"
description: "3 Forensics Challenges: 2 PCAPS, 1 Memory Dump."
sidebar_position: 1
tags: ["forensic"]
---

*January 28, 2024*

3 Forensics Challenges: 2 PCAPS, 1 Memory Dump.

## Challenge 1: Charter (Easy)

---

150 points

### Challenge Description

> The attackers deleted all our files in a recent breach. We managed to recover almost all of them from offsite backups but are missing some important files that were stored on the compromised file server. We managed to capture the traffic during the attack. Can you please help us with this situation and recover our files?
> 
> File(s): `charter.zip`

### Solution

Extract the ZIP file, we had been given a `.pcapng` file. This challenge actually can be solved by `strings`. The network traffic contains a great number of HTML files, but the flag is hidden inside the PCAP file itself.

```text
$ strings traffic.pcapng | grep "HTB{"
an class="c12">&nbsp;</span><span class="c4">2021 All rights reserved. HTB{r3cov3ry_1s_fun_409df1!!}</span></p></div></body></html>
```

## Challenge 2: Penetrated (Medium)

---

250 points

### Challenge Description

> We detected a strange file in the WordPress uploads folder. Luckily we still have a dump of the network traffic at the same time as the file timestamp. We wonder if it was created by the attacker and did he succeed in his goal?
> 
> File(s): `penetrated.zip`

### Solution

Extract the ZIP file, we had been given another `.pcap` file. I called this challenge a “hidden in plain sight” challenge because it covers how attackers send malicious data via legitimate protocols through the network. I have done a [similar challenge](/ctfs/2023/codecombat2023/nightshiftendssoon), just this challenge is using `ICMP` protocol instead of `DNS`.

Inspecting the Protocol Hierarchy, `ICMP` packets have over 98.9% of packets.

Following `TCP Stream 8`, we can see a full action of how the attacker encapsulates the hidden file.

![image](/img/ctfs/newyearmayhem2024-forensics-01.png)

Here are 3 important things that need to be recorded:

1.  The file we need to find is a `.zip` file.
2.  The password of the `.zip` file is `Im4H4ck3rL0rd`.
3.  On the next command, it loops the file into equal hex chunks and sends it along with the `ICMP` requests. From here, we know we need to look at `ICMP` packets.

Filter the `ICMP` packets, we can see a suspicious header `PK` which is a `.zip` file header.

![image](/img/ctfs/newyearmayhem2024-forensics-02.png)

The third and fourth packet indicates the `ConfidentialReport.pdf`, which is the file we need to find.

![image](/img/ctfs/newyearmayhem2024-forensics-03.png)

Therefore, we only need to gather every hex chunk in each `ICMP` packet and piece them together, then obtaining the flag will be trivial. `tshark` is the best tool here and I’ve explained every filter means in my previous write-up. The `-e data` is the hex chunks of the `.zip` file.

```text
$ tshark -r capture.pcap -Y "icmp && ip.src == 192.168.127.131" -T fields -e data | tr -d "\r\n" | xxd -r -p > ConfidentialReport.zip

$ file ConfidentialReport.zip
ConfidentialReport.zip: Zip archive data, at least v2.0 to extract, compression method=deflate
```

Unzip the file with the password that we found earlier.

```text
$ unzip ConfidentialReport.zip 
Archive:  ConfidentialReport.zip
[ConfidentialReport.zip] ConfidentialReport.pdf password: 
  inflating: ConfidentialReport.pdf

$ open ConfidentialReport.pdf
```

![image](/img/ctfs/newyearmayhem2024-forensics-04.png)

## Challenge 3: Infected (Hard)

---

450 points

### Challenge Description

> After a very stressful day at work, after answering thousands of emails, I noticed something bizarre on my computer. During booting, a black window appeared for a second, and something probably locked all my files. I am not sure what happened, but all my files now have the extension .enc. After talking with the IT department, we captured my computer’s memory shortly after the incident. Can you analyze the capture and recover my file?
> 
> File(s): `forensics_infected.zip`

### Solution

To be updated
