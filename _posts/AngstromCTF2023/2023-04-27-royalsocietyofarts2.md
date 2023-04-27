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
In this challenge, we need to bypass the conditional statement from preventing us to access the flag.

```python
if c == m or b"actf{" in long_to_bytes(pow(c, d, n)):
    print("No flag for you!")
    exit(1)
```
By observing both conditions, we can conclude that:

1. `c == m`: This condition preventing the player from brute-forcing the flag. Therefore, even we get the long integer `m` ($$flag$$), we did not know the value is literally the flag.
2. `b"actf{" in long_to_bytes(pow(c, d, n))`: This condition is checking the flag format `actf{`. Therefore, we cannot simply insert the `c` into the input field.
3. The `if` statement accepts any integer inputs outside of **Condition 1** and **Condition 2**.

We need to submit an integer that is closely related to $$m$$ and $$c$$. Hence, we can encapsulate $$c$$ that is generated every single execution by submitting $$c^2$$. This is because $$c^2$$ will not produce the flag format `actf{` after decryption and it will not tampered the original $$flag$$ value. 

$$
\begin{aligned}
    c &= flag^e\ (mod\ n)\\
    c^2 &= (flag^e)^2\ (mod\ n)\\
    flag^2 &= (c^2)^d\ (mod\ n)\\
    flag &= \sqrt(c^2)^d\\ 
\end{aligned}
$$

>NOTE: This method only works if `n`, `p`, and `q` are **larger than** `bytes_to_long(flag)`. We can indirectly verify that `flag` is smaller than both `p` and `q`.

From here, we have our solution.

## 🚩 Solution

{% include video id="1EJveRZdXDf4eqORdCfoFuR1EapxnvroV" provider="google-drive" %}

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

***FLAG***: `actf{rs4_is_sorta_homom0rphic_50c8d344df58322b}`
