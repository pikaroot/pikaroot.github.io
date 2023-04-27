---
title: "impossible [CRYPTO]"
categories: AngstromCTF2023
permalink: /ctfs/angstromctf2023/impossible
---
Binary checker and inequalities with **IF** conditional statement.

## 📁 Challenge Description
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
4. The length of list generated from `fake_psi(a, b)` function must be equal zero.

Continue...

## 🚩 Solution

The [impossible.py](https://files.actf.co/fbb3d3649ac3408c393acd75d08d59c1c52ce87715845251ee34fa212b3dd991/impossible.py) was released after I had submitted the flag. Hence, this video demonstrates some possible combinations to access the flag.

{% include video id="1VMZQpW9KV3Cj2G4XuCm1XLPVdILQLGvV" provider="google-drive" %}

***FLAG***: `actf{se3ms_pretty_p0ssible_t0_m3_7623fb7e33577b8a}`
