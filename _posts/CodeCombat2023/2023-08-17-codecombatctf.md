---
title: "SIBERSIAGA CodeCombat 2023 Write-Up"
categories: CodeCombat2023
permalink: /ctfs/codecombat2023/codecombatctf
toc: true
toc_label: "cat codecombatctf.md"
toc_icon: "terminal"
---
5 challenges: Misc x2, Web x1, Forensic x1, Rev x1

# Math Master [MISC][QUALS]
41.67 points, 12 solves

## 📁 Challenge Description
>Test your mathematical skills in this rapid-fire math challenge! Solve 100 math problems involving minimum, mode, maximum, average, and median calculations within 3 seconds for each question. Do you have what it takes to be a Math Master?
>
>nc math.sibersiaga2023.myctf.io 8887
>
>Flag format: `sibersiaga{strings}`

## 🚩 Solution
The aim of the challenge is to test your custom script development. Basically when you connect to the challenge, it will print out the banner together with the math question one at the time after you had solved it. The challenge description indicates the syllabus of the math questions (`min`, `max`, `mod`, `average`, `median`). The flag will be printed out when your solve count equals 100. 

By solving this kind of challenge, 3 requirements need to be met.

1. You must understand how to use `pwntools`. (It is by far the easiest tool to solve it.)
2. You must understand `Python`. :D
3. You must know how to deal with data types. (e.g., b'3', '3', 3 are three different data types over here.)

Here is my ~~shamless~~ `solve.py` script.

```python
#!/usr/bin/env python3
from pwn import *

def math_func(ques):
	li = [] # Always clear the list every time the function gets called.

	if "Min from " in ques:
		element = ques[10:-1]
		elements = list(element.split(', '))
		for num in elements:
			li.append(int(num))
		li.sort()
		return li[0] # Return first element.
			
	if "Max from " in ques:
		element = ques[10:-1]
		elements = list(element.split(', '))
		for num in elements:
			li.append(int(num))
		li.sort()
		return li[-1] # Return last element

	if "Median of " in ques:
		element = ques[11:-1]
		elements = list(element.split(', '))
		for num in elements:
			li.append(int(num))
		li.sort()
		if len(li) % 2 != 0:
			ans = li[len(li)//2]
		else:
			ans = (li[len(li)//2 - 1] + li[len(li)//2]) / 2 # Median calculation.
		return ans

	if "Average of " in ques:
		element = ques[12:-1]
		elements = list(element.split(', '))
		total = 0
		for num in elements:
			total += int(num)
		return total/len(elements) # Average calculation.

	if "mod" in ques:
		element = ques[1:-1]
		elements = list(element.split(' mod '))
		ans = int(elements[0]) % int(elements[1]) # Modulus calculation.
		return ans

s = remote('math.sibersiaga2023.myctf.io', 8887)
count = 0

while count != 100:
	s.recvuntil(b':')
	ques = s.recvline().decode().strip().replace('\r\n', '') # Math question.

	ans = math_func(ques)
	s.sendline(str(ans).encode())
	s.recvline() # Repeat the line we sent.
	s.recvline() # b'Correct! Next Question.'
	count += 1

print(s.recvline().decode().strip())
print(s.recvline().decode().strip())
s.close()
```
Output:
```
[x] Opening connection to math.sibersiaga2023.myctf.io on port 8887
[x] Opening connection to math.sibersiaga2023.myctf.io on port 8887: Trying 128.199.224.232
[+] Opening connection to math.sibersiaga2023.myctf.io on port 8887: Done
Congratulations! You are fast enough!
The flag is sibersiaga{7h1nk_f4573r_cyb3r_7hr00p3r5}
[*] Closed connection to math.sibersiaga2023.myctf.io port 8887
```

***FLAG***: `sibersiaga{7h1nk_f4573r_cyb3r_7hr00p3r5}`

# Cryptic Equation Conundrum [MISC][FINALS]
500 points, 1 solve (1st 🩸 & only 🩸)

## 📁 Challenge Description
>You've stumbled upon a mysterious program that claims to test your mathematical skills. The program generates a series of complex mathematical equations and challenges you to solve them within a tight time limit. Are you up for the challenge?
>
>nc cryptic.sibersiaga2023.myctf.io 9999
>
>Flag format: `sibersiaga{flag}`

## 🚩 Solution

This challenge took my 4 hours to solve it. This is the upgraded version since `Math Master` in the qualifying round. The concept is the same, however, it requires additional things such as trigonometry calculation, encryption and decryption, and the solve count needs to be reached until 1000 instead of 100 in order to retrieve the flag.

By manually playing around with the encrypted math challenges, we concluded with two major encryption schema.

1. **Base64 + XOR**: Questions that contain **b'{content}'** should be encrypted by this encryption scheme. This can be found via the `Magic` function in [CyberChef](https://gchq.github.io/CyberChef/).
2. **ASCII Shift Cipher**: Questions that not contain **b'{content}'** are belong to this encryption scheme. This can be found via `ROT13` function in [dCode](https://www.dcode.fr/rot-13-cipher). In the ROT function, you will notice the "Find" word is revealed but another portion is remain encrypted. However, some results do reveal the math question due to that it is instead decrypted using ASCII Shift Cipher instead of ROT Cipher.

After scripting the decryption part, there are 2 types of math questions.

1. **Normal Arithmetic**: e.g., `96 * 2 + 96 * 4`, `8354 / 2 - 763`, etc.
   [[image]]
2. **Trigonometry**: e.g., `cos(5)`, `sin(67)`, `tan(54)`, etc.
   [[image]]

Take note that the value of each trigonometry question was calculated using **radians** instead of **degrees**. This can be concluded from connecting the challenge server as it will print the correct answer when your answer given is incorrect.

Moreover, I had encountered that trigonometry questions generated from ASCII Shift Cipher sometimes will return inconsistent results, causing error during calculation.

```
e.g., Find co<0x61>(38)
e.g., Find <0x38>in(66)
e.g., Find <0x45>an(79)
```

I almost ended up giving up solving this challenge until my legend teammate suggested me to look for patterns of trigonometry questions. Luckily, the result always stay inconsistent on the same letter of each trigonometry function.

Hence, my script ended up finding `in` for sine function, `co` for cosine function, `an` for tangent function.

Here is my ~~anotehr shamless~~ `solve.py` script.

```python
#!/usr/bin/env python3
from pwn import *
from math import *
from base64 import b64decode
import string

def apply_ascii_shift(text, shift):
    result = ""
    for char in text:
        if char.isprintable() and char != ' ':
            ascii_offset = ord('!')
            shifted = (ord(char) - ascii_offset + shift) % 95 + ascii_offset
            result += chr(shifted)
        else:
            result += char
    return result

def ascii_func(x):
	for shift in range(95):  # There are 95 printable ASCII characters
		decoded_text = apply_ascii_shift(x, shift)
		if "Find" in decoded_text:
			return str(decoded_text)
			break

def base64_xor_func(x):
	x = x[2:-1]
	decode = b64decode(x)
	for i in range(127):
		a = hex(i)
		xor = ''.join(chr(b ^ int(a[2:], 16)) for b in decode)
		if "Find" in xor:
			return xor
			break

def calc(x):
	f = str(x)[5:]
	if "in" in f: # Sine function
		angle_in_degrees = f[4:-1]
		angle_in_radians = math.radians(int(angle_in_degrees))
		sin_value = math.sin(angle_in_radians)
		result = round(sin_value, 2) # Round to 2 decimal points
		return result

	if "co" in f: # Cosine function
		angle_in_degrees = f[4:-1]
		angle_in_radians = math.radians(int(angle_in_degrees))
		cos_value = math.cos(angle_in_radians)
		result = round(cos_value, 2) # Round to 2 decimal points
		return result

	if "an" in f: # Tangent function
		angle_in_degrees = f[4:-1]
		angle_in_radians = math.radians(int(angle_in_degrees))
		tan_value = math.tan(angle_in_radians)
		result = round(tan_value, 2) # Round to 2 decimal points
		return result

	else: # Normal Arithmetic
		result = eval(f)
		if "/" not in str(result):
			result = int(result)
		return result
	
s = remote('cryptic.sibersiaga2023.myctf.io', 9999)
count = 0
s.recvuntil(b'.\r\n').decode().strip()

while count != 1000:
	test = s.recvline().decode().strip()[19:-2]

	if "b'" in test:
		ans = base64_xor_func(test)
		ans = calc(ans)
	else:
		ans = ascii_func(test)
		ans = calc(ans)

	s.sendline(str(ans).encode())
	s.recvline()
	s.recvline()
	count += 1

print(s.recvline().decode().strip())
print(s.recvline().decode().strip())
s.close()
```
Output:
```
[x] Opening connection to cryptic.sibersiaga2023.myctf.io on port 9999
[x] Opening connection to cryptic.sibersiaga2023.myctf.io on port 9999: Trying 128.199.224.232
[+] Opening connection to cryptic.sibersiaga2023.myctf.io on port 9999: Done
Congratulations! You are worthy!
The flag is sibersiaga{cyb3r_7hr00p3r5_y0u_4r3_w0rthy_3n0ugh}
[*] Closed connection to cryptic.sibersiaga2023.myctf.io port 9999
```

***FLAG***: `sibersiaga{cyb3r_7hr00p3r5_y0u_4r3_w0rthy_3n0ugh}`

# Cloud Storage V2 [WEB][FINALS]
55.56 points, 9 solves

## 📁 Challenge Description
>I've upgraded the upload system to a new one. You may no longer exploit it now!
>
>`http://cloudstorage.sibersiaga2023.myctf.io/`
>
>flag is in `/home/flag.txt`
>
>Flag format: `sibersiaga{md5hash}`

## 🚩 Solution
Explanation in progress.

***FLAG***: `sibersiaga{9c44f131b9d72f89d9a1c8520c42468d}`

# Night Shift Ends Soon [FORENSIC][QUALS]
125 points, 4 solves (1st 🩸)

## 📁 Challenge Description
>Ahmad was on his night shift when he remotely via the monitoring console, observed an unusual network activity from a user's segment of one of the branch offices. It is strange to see someone still in the branch office at this time. After consulting his other team member on duty, Ahmad decided to run a packet capture, capturing packets from the machine. He did some analysis on the captured packet, but he couldn't find anything suspicious - maybe someone is actually still in office during that time. His shift is ending soon. He needs to get someone from the next shift to help with this. And that someone is you.
>
>Please access this artifact: `https://drive.google.com/file/d/1M0iVNeEGCxRzTEIkN03EwLE7NBidVcw/view`
>
>Password: `sibersiaga2023`
>
>Flag format: `sibersiaga{flag}`

## 🚩 Solution
When we have been given a `.pcap` file, it would always be good to look into the protocol hierarchy to investigate which protocol we are most likely will be dealing with.

[[Image]]

The most possible protocol will be dealing with `DNS` packets as there are zero `HTTP` packets captured and packets such as `QUIC`, `TLSv1.2`, etc. (without any extra information given) are not worth deep diving in as they are encrypted packets.

Roughly looking on it, there are quite a lot of DNS packets going on in Wireshark. Hence, we can utilize `tshark` to grab every hostname from all DNS packets in the given `.pcap` file and save it into a new file `dns.txt`.

`tshark` is yet another alternative packet analysis tool but in command line interface (CLI). The advantage given is that it can be used together with other advanced tools such as `tr`, `awk`, `sed`, `cut`, `grep`, etc. during packet filtering.  

```
$ tshark -r pcap01.pcapng -f fields -e dns.qry.name | sed '/^$/d' | uniq > dns.txt
```

Looking into the `dns.txt` file, there are some hostnames are encoded with random format which possibly lead to potential foothold. By playing around those hostnames, there is one domain utterly interesting and catch my eyes which is `a.thectf.site`.

We discovered that every subdomain of `a.thectf.site` can be decoded using **BASE 32**. The decoded string is actually `PNG` raw binaries. Hence, every subdomain had also been given an identifier stated the order of the string should be placed. Therefore, these raw binary strings can be pieced together to reconstruct a `PNG` image.

All the reconstruction processes can be done by the power of CLI tools.

I will ~~use some algebraic representations to~~ explain the tools I will be using to get the image easily.

```
$ cat dns.txt | grep 'a.thectf.site' == cmd1 # filter hostnames that only have a.thectf.site.
$ cmd1 | uniq == cmd2                        # filter repetitive hostnames.
$ cmd2 | cut -d. -f1 | cut -d- -f2 == cmd3   # keep only the encoded subdomains and remove other information.
$ cmd3 | tr -d "\n\r" == cmd4                # remove new lines.
$ cmd4 | sed 's/.\{3\}$//' == cmd5            # remove the last 3 lines (include the last empty line).
$ cmd5 | base32 -d > flag.png == cmd6        # decode using base32 and save it to flag.png.
$ cmd6 && eog flag.png                       # view the content of flag.png.
```

Final command.

```
$ cat dns.txt | grep 'a.thectf.site' | uniq | cut -d. -f1 | cut -d- -f2 | tr -d "\n\r" | sed 's/.\{3\}$//' | base32 -d > flag.png && eog flag.png
```

[[Image]]

Hence, this proved our path is correct and the flag is revealed.

***FLAG***: `sibersiaga{9838471a326513ca81498eb844ade8a9}`

# Note [REV][QUALS]
50 points, 10 solves

## 📁 Challenge Description
>Our company recently received a file claiming to contain flags for Sibersiaga 2023. When opening the file, all it showed was a blurred page with a "click here to view" button. So far, nothing has happened to out employees. Yet. Please investigate this one note at your earliest convenience. Disclaimer: -This contains real malware. Please proceed in a safe environment. -Do not upload file on VT or any malware sandbox to avoid fingerprint and bad labelling.
>
>Password: `infected`
>
>Flag format: `sibersiaga{strings}`

## 🚩 Solution
Explanation in progress.

***FLAG***: `sibersiaga{s4Tu_n0T4_m41w4Re}`
