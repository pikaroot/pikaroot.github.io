---
title: "Cryptic Equation Conundrum [MISC]"
categories: CodeCombat2023
permalink: /ctfs/codecombat2023/crypticequationconundrum
---

Advanced version of **Math Master**. Calculate 1000 math questions within 5 seconds each.

## 📁 Challenge Description

>You've stumbled upon a mysterious program that claims to test your mathematical skills. The program generates a series of complex mathematical equations and challenges you to solve them within a tight time limit. Are you up for the challenge?
>
>`nc cryptic.sibersiaga2023.myctf.io 9999`
>
>Flag format: `sibersiaga{flag}`

500 points, 1 solve (1st 🩸 & only 🩸)

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
Decrypt and solve: Hkpf **;229 , 452:+ - 597:+
<input>
<repeat your input>
Wrong answer.
Result: 20791914
```

## 🚩 Solution

This challenge took me 4 hours to solve it. This is the upgraded version since `Math Master` in the qualifying round. The concept is the same, however, it requires additional things such as trigonometry calculation, encryption, and decryption, and the solve count needs to be reached until 1000 instead of 100 in order to retrieve the flag.

By manually playing around with the encrypted math challenges, we concluded 2 types of encryption schemas.

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
