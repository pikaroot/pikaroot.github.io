---
title: "Impossible [CRYPTO]"
categories: AngstromCTF2023
permalink: /ctfs/angstromctf2023/impossible
---
Binary checker and inequalities with **IF** conditional statement.

## 📁 Challenge Description
50 points, 503 solves

>Is this challenge impossible?

[impossible.py](https://files.actf.co/fbb3d3649ac3408c393acd75d08d59c1c52ce87715845251ee34fa212b3dd991/impossible.py)

```python
#!/usr/local/bin/python

def fake_psi(a, b):
    return [i for i in a if i in b]

def zero_encoding(x, n):
    ret = []

    for i in range(n):
        if (x & 1) == 0:
            ret.append(x | 1)

        x >>= 1

    return ret

def one_encoding(x, n):
    ret = []

    for i in range(n):
        if x & 1:
            ret.append(x)

        x >>= 1

    return ret

print("Supply positive x and y such that x < y and x > y.")
x = int(input("x: "))
y = int(input("y: "))

if len(fake_psi(one_encoding(x, 64), zero_encoding(y, 64))) == 0 and x > y and x > 0 and y > 0:
    print(open("flag.txt").read())
```
## 👀 Analysis
The conditions to read the flag are listed below:

1. `x` must be larger than `y`.
2. `x` must be positive.
3. `y` must be positive.
4. The length of list generated from `fake_psi(a, b)` function must be empty.

One way to solve this question is create own `impossible.py` and `flag.txt` in localhost for testing, and print the output `x` and `y` out to verify whether it satisfies the condition `len(fake_psi(one_encoding(x, 64), zero_encoding(y, 64))) == 0`.

Assume we have satisfied the first 3 conditions at above, if we insert `x = 2` and `y = 1`, the output will be:

```
ret = [3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
ret = [1]
```
From the output given, the final list from `fake_psi()` function will not be empty and it will return `[1]` as `1` is the common element in both lists.

If we insert a large number `x = 111111111111111111111` and `y = 1`, the output will be:

```
ret = [13888888888888888889, 6944444444444444445, 3472222222222222223, 217013888888888889, 108506944444444445, 54253472222222223, 3390842013888889, 1695421006944445, 847710503472223, 26490953233507, 6622738308377, 3311369154189, 1655684577095, 206960572137, 103480286069, 51740143035, 12935035759, 808439735, 101054967, 12631871, 197373, 98687, 771, 193, 97, 49, 25, 13]
ret = [1]
```
From the output given, there is no common element in both lists. Hence, `len(fake_psi(one_encoding(x, 64), zero_encoding(y, 64)))` will result in zero element. We have our solution.

>It is worth noting that the last element in list `x` must be larger than the last element in list `y` to get the flag which is `13 > 1` in the example above. Hence, `x` must be large enough to avoid bits shifting to `1`.

## 🚩 Solution

The [impossible.py](https://files.actf.co/fbb3d3649ac3408c393acd75d08d59c1c52ce87715845251ee34fa212b3dd991/impossible.py) was released after I had submitted the flag. Hence, this video demonstrates some possible combinations to access the flag.

{% include video id="1VMZQpW9KV3Cj2G4XuCm1XLPVdILQLGvV" provider="google-drive" %}

solve.py
```python
#!/usr/bin/env python3
from pwn import *

context.log_level = 'critical'

x = 111111111111111111111
y = 1

io = remote('challs.actf.co', 32200)
io.recvuntil(b':')
io.sendline(str(x)).encode()
io.recvuntil(b':')
io.sendline(str(y)).encode()

print(io.recvline().decode())

io.close()
```

***FLAG***: `actf{se3ms_pretty_p0ssible_t0_m3_7623fb7e33577b8a}`
