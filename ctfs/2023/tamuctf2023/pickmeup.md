---
title: "Pick Me Up [MISC]"
description: "OSINT Challenge. Find the arrival time and the gate number of the flight!"
sidebar_position: 1
tags: ["misc"]
---

*May 1, 2023*

OSINT Challenge. Find the arrival time and the gate number of the flight!

## Challenge Description

187 points, 178 solves

> You’re supposed to pick your friend up at the airport, but she didn’t send you any information! When does this flight actually arrive and where should you pick her up? This screenshot was taken on **4/20**.
> 
> The flag format is **`gigem{HH:MM-Gate}` in CDT** with HH being hour in **24 hour time** and MM for the minutes. Gate represents the gate that the plane **arrives** at. For example, if you were picking your friend up at `4:20 PM CDT` at `gate A1` would yield the flag `gigem{16:20-A1}`.

[pick-me-up.zip](https://tamuctf.com/files/8f4f8db5e28656355e3a2ded9ba73b3b/pick-me-up.zip?token=eyJ1c2VyX2lkIjo4NywidGVhbV9pZCI6NjMsImZpbGVfaWQiOjMyfQ.ZE8-pQ.vsL7DEo4dwhQBspF9x56ackXy2g)

![IMG_5070](/img/ctfs/tamuctf2023-pickmeup-01.jpg)

Translation:

```text
White: Hi, I just arrived at Taipei (TPE), how was the situation from your side? (4/19 22:42)
Green: I maybe have the time to fetch you at IAH airport tomorrow. 🌠😊 (4/19 22:42)
White: [PHOTO] (4/20 08:50)
White: About to board! (4/20 08:50)
Green: Hey, hold up, you haven't send me the flight schedule. (4/20 12:06)
Green: Errr... 😅 (4/20 12:06)
```

## Analysis

Let’s arrange the information that we got.

1.  The flag format should be: `gigem{HH:MM-Gate}`. Time is 24-hour format in CDT.
2.  The screenshot was taken on `4/20`.
3.  The two airports that were mentioned are `TPE` and `IAH`.
4.  `TPE` is the departure flight, `IAH` is the destination.
5.  The `[PHOTO]` in the screenshot is Taipei airplane company `EVA Airways`.

Results of `[PHOTO]` via [Google Lens](https://lens.google/).

![pick-me-up-google-lens](/img/ctfs/tamuctf2023-pickmeup-02.png)

The whole idea is to find the flight history from **TPE** to **IAH** on **20 April 2023**. Hence, we can attempt to find flight history of EVA Airways to narrow down tons of googling.

Image of google search.

![pick-me-up-search](/img/ctfs/tamuctf2023-pickmeup-03.png)

Go to the [first search result](https://flightaware.com/live/flight/EVA52), scroll down we can see a list of past flights.

![pick-me-up-clue](/img/ctfs/tamuctf2023-pickmeup-04.png)

From here, we have our solution.

## Solution

Final [answer](https://flightaware.com/live/flight/EVA52/history/20230420/1410Z/RCTP/KIAH).

![pick-me-up-answer](/img/ctfs/tamuctf2023-pickmeup-05.png)

> Do not forget 12AM is 0000 in 24-hour format.

***FLAG***: `gigem{00:28-D7}`
