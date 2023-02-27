---
title: "Red Teaming: HAVOC 101 Workshop"
---
HAVOC C2, Active Directory, and Red Teaming.

## ☁️ Before we start
A short recap about the workshop. The **"Red Team Ops: HAVOC 101"** is a 3-hours workshop that discusses about red teaming techniques and C2C concepts, and it is an honour to attend this session as a speaker with [Wesley](https://github.com/WesleyWong420). This workshop covers 3 main chapters:
- Chapter 1: Introduction to Command & Control Framework
- Chapter 2: OPSEC & Defense Evasion
- Chapter 3: Compromise Active Directory Domain Services

[Chapter 1 & 2](https://github.com/WesleyWong420/RedTeamOps-Havoc-101) had been conducted by Wesley. However, the last chapter had not yet been completed physically due to time limitation. Therefore, I decided to write a complete guide on how to compromise a simple AD network as an alternative.

## 🪟 Active Directory
In an organization or a university, you will realize you are able to login most of the domain computers with your own credentials and always able to get your desktop back to work even if the devices are located in places such as the library and other classrooms. This is the capability of **Active Directory (AD)**. 

Active Directory is a database or set of services that connects users with the network resources they need to complete their daily work. Critical information is stored in AD such as **users**, **computers**, and **roles**. 

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
Some texts here...

## 💉 Compromise AD Walkthrough
Some texts here...

## 🗣️ Conclusion
Some texts here...

## 🟦 References

1. [Havoc Framework](https://github.com/HavocFramework/Havoc)
