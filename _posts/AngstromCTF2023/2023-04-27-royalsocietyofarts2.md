---
title: "Royal Society of Arts 2 [CRYPTO]"
categories: AngstromCTF2023
permalink: /ctfs/angstromctf2023/royalsocietyofarts2
---
RSA challenge with the combination of flag regex checker. 

## 📁 Challenge Description
>RSA strikes strikes strikes strikes strikes again again again again again!

[rsa2.py](https://files.actf.co/d7936f17479cf876d206846ac79f058b4169e0f890310dfd46465a40d3a030c5/rsa2.py)

```python
from Crypto.Util.number import getStrongPrime, bytes_to_long, long_to_bytes
f = open("flag.txt").read()
m = bytes_to_long(f.encode())
p = getStrongPrime(512)
q = getStrongPrime(512)
n = p*q
e = 65537
c = pow(m,e,n)
print("n =",n)
print("e =",e)
print("c =",c)

d = pow(e, -1, (p-1)*(q-1))

c = int(input("Text to decrypt: "))

if c == m or b"actf{" in long_to_bytes(pow(c, d, n)):
    print("No flag for you!")
    exit(1)

print("m =", pow(c, d, n))
```

## 👀 Analysis


## 🚩 Solution

solve.py
```python
#!/usr/bin/env python3
from pwn import *
from Crypto.Util.number import long_to_bytes
from sage.all import *

print("Use CTRL+B to run code in Sublime Text")
context.log_level = 'critical'

io = remote("challs.actf.co", 32400)
io.recvline() # n value
io.recvline() # e value
c = io.recvline().split(b'=')[1].decode() # c value
io.recvuntil(b':') # Type to decrypt:
io.sendline(str(int(c)**2).encode())
m_square = io.recvline().split(b'=')[1].decode()
io.close()

FLAG = int(sqrt(m_square))
print(long_to_bytes(FLAG))
```

<iframe src="https://user-images.githubusercontent.com/107750005/234778322-fdb1a501-13e2-4d5e-9799-6e426832686d.mp4" width="720" height="560" frameborder="0"> </iframe>

