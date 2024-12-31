---
title: "math master [misc]"
categories: CodeCombat2023
permalink: /ctfs/codecombat2023/mathmaster
---

Python scripting development to calculate 100 math questions within 3 seconds each.

## Challenge Description
>Test your mathematical skills in this rapid-fire math challenge! Solve 100 math problems involving minimum, mode, maximum, average, and median calculations within 3 seconds for each question. Do you have what it takes to be a Math Master?
>
>`nc math.sibersiaga2023.myctf.io 8887`
>
>Flag format: `sibersiaga{strings}`

41.67 points, 12 solves

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
Find: Min from [23, 45, 123, 1, 654, 700, 4]
<input>
<repeat your input>
Wrong answer.
```

## Observation
The challenge aims to test your custom script development. When you connect to the instance, it will print out the banner together with the math question one at a time after you have solved it. The challenge description indicates the syllabus of the math questions (`min`, `max`, `mod`, `average`, and `median`). The flag will be printed out when your solve count equals 100. 

To solve this kind of challenge, 3 requirements need to be met.

1. You must understand how to use `pwntools`. (It is by far the easiest tool to solve it.)
2. You must understand `Python`. :D
3. You must know how to deal with data types. (e.g., `b'3'`, `'3'`, and `3` are three different data types over here.)

## Solution

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
