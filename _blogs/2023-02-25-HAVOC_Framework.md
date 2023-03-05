---
title: "Red Teaming: HAVOC 101 Workshop"
---
HAVOC C2, Active Directory, and Red Teaming.

## ☁️ Before we start

![image](https://user-images.githubusercontent.com/107750005/221825520-4e5e2a23-3deb-435d-8445-30bc0f17bad3.png)

A short recap about the workshop. The **"Red Team Ops: HAVOC 101"** is a 3-hours workshop that discusses about red teaming techniques and C2C concepts, and it is an honour to attend this session as a speaker with [Wesley](https://github.com/WesleyWong420). This workshop covers 3 main chapters:
- Chapter 1: Introduction to Command & Control Framework
- Chapter 2: OPSEC & Defense Evasion
- Chapter 3: Compromise Active Directory Domain Services

[Chapter 1 & 2](https://github.com/WesleyWong420/RedTeamOps-Havoc-101) had been conducted by Wesley. However, the last chapter had not yet been completed physically due to time limitation. Therefore, I decided to write a complete guide on how to compromise a simple AD network as an alternative.

## 🪟 Active Directory
In an organization or a university, you will realize you are able to login most of the domain computers with your own credentials and always able to get your desktop back to work even if the devices are located in places such as the library and other classrooms. This is the capability of **Active Directory (AD)**. 

Active Directory is a database or set of services that connects users with the network resources they need to complete their daily work. Critical information is stored in AD such as **users**, **computers**, and **roles**. In terms of security configurations, AD provides flexibility on different aspects of defense measures and services such as Group Policy Management, Key Distribution Center (KDC), User Access Permissions, for Administrators to reduce their workloads and apply standard protection against potential threats.

Some terminologies in an AD are good to know including:

- `Forest`: The largest view of the Active Directory. Collection of `Trees`.
- `Tree`: Collection of `Domains`.
- `Domain`: Collection of `Organization Units (OUs)` and `Objects`.
- `OUs`: Collection of `Objects`.
- `Object`: Such as `Domain Admins`, `Domain Controllers`, `Domain Computers`, `Domain Users`, etc.
- `Domain Admins`: The "bosses" of a specific domain as a **USER**. They had full access of all network resources in the domain.
- `Domain Controllers`: The "bosses" of a specific domain as a **COMPUTER**. These computers able to manage and control all network resources in the domain.
- `Domain Computers`: Workstations in a specific domain.
- `Domain Users`: Clients in a specific domain. They only had limited access in the domain.

## 🎟️ Kerberoasting
> Crash course of understanding Kerberos authentication protocol.

![image](https://user-images.githubusercontent.com/107750005/221415624-f7b2ed9c-c9a9-4ec3-ad85-7583aca1f0f0.png)

1. When a `client` wants to login to a domain computer, this event will be verified by the `authentication server`.
2. After the `authentication server` had verified the existence of the credentials of the `client` in the `SQL Server`. It returns a TGT back to the `client`.
3. The `client` then send the TGT to the `TGS`, requesting access permission of the `network resources` in the domain.
4. The `TGS` knows the `client` is authenticated and it will respond back a client-to-server ticket to the `client`.
5. The client-to-server ticket can be used for requesting specific services in the domain.
6. Services will be provided from the `network resources` in the domain.

> A ticket-granting-ticket (TGT) acts as a universal pass for accessing all the `Network Resources` in the domain instead of inserting username and password over and over again.

## 💻 Network Verification
Before moving on to the walkthrough, I want to ensure the AD network (DC01, WORKSTATION-01, WORKSTATION-02) is connected as intended. Hence, it is recommended doing the following verifications:

**1) Ensure the Domain Computers are attached to the Domain Controller.**

Type the following command `nltest /sc_query:havoc.local` in both workstations to ensure domain connection. If the output contains the wording **Flags: 30 HAS_IP HAS_TIMESERV** and **Trusted DC Name \\\\DC01.havoc.local**, the specific workstation is connected to the `DC01` successfully. Otherwise, it is not connected to `havoc.local` domain.

![WORKSTATION-01](https://media.giphy.com/media/eYMHsWjNsUiHcbexQa/giphy.gif)
![WORKSTATION-02](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2RkODRmZGMzZjc3NTIyNGI5Yjk1OWExNDdlNmUxMGY1YTMxMGI5ZSZjdD1n/6Ruy61n5BLVgmsgSTD/giphy.gif)

Next, go to ***Start Menu > Type "Firewall"***. At the Domain networks, please verify the **Active domain networks:** is `havoc.local`. If the active domain network is ***None***, the specific workstation is not really joining the domain network.

![WORKSTATION-01](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTc0NDg3NmJiZmY4NTU2OWM5YzRiMzI5YzJhM2NmZDU2YmE0OTY0YyZjdD1n/K4eQBRdvfSqYfJ9IIK/giphy.gif)
![WORKSTATION-02](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGExMTM3ODY1NDM2MmYwZGVmODFiOGZmN2EwZDQ3N2U3NGM2YTc3MSZjdD1n/mOihdfEJ33tWlmIELf/giphy.gif)

**2) Ensure the Domain Computers can communicated each other in the domain.**

In **WORKSTATION-01** Windows Defender Firewall, click ***Advanced settings > Inbound Rules > File and Printer Sharing (Echo Request - ICMPv4-In)***, enable all the rules with the ICMPv4-In **(Enabled: "Yes")**. Do the same verification in **WORKSTATION-02**.

![WORKSTATION-01](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODU4NjI5ZDUwNTk1NGFiMDkzNmM2NDk0YzEzNzNjOTg2ZTE2NzM4MyZjdD1n/o3ieXUduyKrBX2penp/giphy.gif)
![WORKSTATION-02](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTEyMTEzMGFiNjdkMTcyNTFmY2M0YTQ3Njk3MmM3NzM0ZGQ4MTIwZCZjdD1n/s12zA77hbZUE6P5FzZ/giphy.gif)

In **WORKSTATION-01**, ping **DC01.havoc.local** and **WORKSTATION-02.havoc.local** to ensure communication. Do the same verification in **WORKSTATION-02**.

![WORKSTATION-01](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmI2ZDViODI3NWUyNTk2NjUwMzYyNTJjYzk3Mzc3MGJlYTBkNDQ0OSZjdD1n/UORuqmjegfWLSCVaZu/giphy.gif)
![WORKSTATION-02](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGVhYWJhZmQxNmRiNGRjZDU4NDBmMDc0MDdhMWE1Y2Y3OTY1ODUxYSZjdD1n/pVI71iGqUx3H9NONuR/giphy.gif)

**3) Ensure the VM Network Adapters are correctly applied.**

> **DC01.havoc.local** only has the static IP `10.10.101.131`.

Type the command `ipconfig` in both workstations to verify the number of adapters added.

- **WORKSTATION-01.havoc.local**: 3 Networks ( `NAT Network`, `10.10.100.128`, `10.10.101.129` )
- **WORKSTATION-02.havoc.local**: 2 Networks ( `10.10.100.129`, `10.10.101.132` )

![WORKSTATION-01](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjJlZGE4ZDgxZGI5MWY4MTZmYzU4ODMzZTBhYzJkNDFkZWFmNDE5NCZjdD1n/pDK5hqDduQHjsSh6fX/giphy.gif)
![WORKSTATION-02](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWQ1MDM5NTUyYjZmYWFhNjc5OTUxNDg1YjdkYWZjZDg1NzUyZDRlNyZjdD1n/SetYAeAFV0lFBNvdjV/giphy.gif)

Once the verification is done, we can move on to the next section.

## 💉 Compromise AD Walkthrough

> Turn off the ***Automatic Sample Submission*** in all of the VMs in the Windows Defender Security settings.

![image](https://user-images.githubusercontent.com/107750005/222167859-1e1a9173-a3ea-41a2-9ad2-c8fd9029eb1f.png)

In the scenario above, you are given 1 Attacker Windows with essentials tools need to be compiled, 1 Attacker Linux box with Havoc Framework and essential tools pre-installed, and 1 low-level user credentials in WORKSTATION-01. All user credentials including "Domain Admins" had also been given in the course material because it is used for troubleshooting purposes and it will not be utilized during the walkthrough as all machines need to be up in order to let the attacks functional. To let the machines to be powered on 24/7, go to ***Start Menu > Search for "Power, sleep, and battery settings" > Screen and sleep > Select "Never"***

| Machines         | Username    | Password       |
|------------------|-------------|----------------|
| Attacker Windows | `havoc`     | `havoc`        |
| Attacker Linux   | `havoc`     | `havoc`        |
| WORKSTATION-01   | `a.tarolli` | `Password123!` |

For comprimising the domain, ***5 stages*** are included which are:

- Initial Access (Callback Host)
- Local Privilege Escalation
- Kerberoasting
- Lateral Movement
- Pivoting

### 📑 Initial Access
Some texts here...

{% include video id="ORPrpKvO56M" provider="youtube" %}

Some texts here...

{% include video id="gXnUztTydKk" provider="youtube" %}

### 🚩 Local Privilege Escalation
Some texts here...

{% include video id="TyFHmhjm5ig" provider="youtube" %}

### 💠 Kerberoasting
Some texts here...

{% include video id="sHB_REMIJNQ" provider="youtube" %}

### ⏫ Lateral Movement
Some texts here...

### ⛓️ Pivoting
Some texts here...

## 🗣️ Conclusion
Throughout this blog, we had covered a short introduction about what is Active Directory and a little sneak peak about Kerberos authentication. Then, we ensure that our AD lab environment is totally functional by doing some network verifications before diving into the fun stuffs. Moreover, we have gone through how attackers can bypass Windows AV and get a callback host by utilizing HAVOC framework. Besides that, one example attack in each stage had been discussed including ***unquoted service paths***, ***unconstrained delegation***, ***pivoting attacks***, etc. and eventually compromise the whole domain.

In conclusion, I hope this article is detailed enough to benefit people for learning interesting topics and apply these gains to related work such as education, certification exams, projects, home lab practice, and more. (but not for illegal actions 💀 plzzz...)

## 🟦 References

1. [GitHub - Havoc Framework](https://github.com/HavocFramework/Havoc)
2. [GitHub - HAVOC 101 Workshop Course Material](https://github.com/WesleyWong420/RedTeamOps-Havoc-101)
3. [HackTricks - Unconstrained Delegation](https://book.hacktricks.xyz/windows-hardening/active-directory-methodology/unconstrained-delegation)
