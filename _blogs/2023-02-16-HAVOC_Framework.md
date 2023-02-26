---
title: "Red Teaming: HAVOC 101 Workshop"
---
HAVOC C2, Active Directory, and Red Teaming.

## 🎟️ Kerberoasting
![image](https://user-images.githubusercontent.com/107750005/221415624-f7b2ed9c-c9a9-4ec3-ad85-7583aca1f0f0.png)

> A ticket-granting-ticket (TGT) acts as a universal pass for accessing all the `Network Resources` in the domain instead of inserting username and password over and over again.

1. When a `client` wants to login to a domain computer, this event will be verified by the `authentication server`.
2. After the `authentication server` had verified the existence of the credentials of the `client` in the `SQL Server`. It returns a TGT back to the `client`.
3. The `client` then send the TGT to the `TGS`, requesting access permission of the `network resources` in the domain.
4. The `TGS` knows the `client` is authenticated and it will respond back a client-to-server ticket to the `client`.
5. The client-to-server ticket can be used for requesting specific services in the domain.
6. Services will be provided from the `network resources` in the domain.

To be continue...

## 🟦 References

1. [Havoc Framework](https://github.com/HavocFramework/Havoc)
