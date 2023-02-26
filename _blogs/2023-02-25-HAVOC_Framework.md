---
title: "Red Teaming: HAVOC 101 Workshop"
---
HAVOC C2, Active Directory, and Red Teaming.

## ☁️ Before we start
A short recap about the workshop. The **"Red Team Ops: HAVOC 101"** is a 3-hours workshop that discusses about red teaming techniques and C2C concepts, and it is an honour to attend this session as a speaker with [Wesley](https://github.com/WesleyWong420). This workshop covers 3 main chapters:
- Chapter 1: Introduction to Command & Control Framework
- Chapter 2: OPSEC & Defense Evasion
- Chapter 3: Compromise Active Directory Domain Services

[Chapter 1 & 2](https://github.com/WesleyWong420/RedTeamOps-Havoc-101) had been conducted by Wesley. However, the last chapter had not yet been completed physically due to time limitation. Therefore, I decided to write a complete guide on how to compromise a simple AD network as an alternative. (This guide will be the same as what I want to share in the workshop)

## 🪟 Active Directory
Some texts here...

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

## 💉 Compromise AD Walkthrough
Some texts here...

## 🗣️ Conclusion
To be continue...

## 🟦 References

1. [Havoc Framework](https://github.com/HavocFramework/Havoc)
