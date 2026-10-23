---
title: "Color [STEG]"
description: "Basic QR Code Challenge based on RGB Color Model."
sidebar_position: 2
tags: ["steg"]
---

*December 24, 2022*

Basic QR Code Challenge based on RGB Color Model.

## Challenge Description

> Please message us on discord if you are colorblind (Because I’m easy come, easy go, Little high, little low,)

![image](/img/ctfs/wargamesmy2022-color-01.png)

## Solution

We get a QR code with multiple colors. The solution for this challenge is that the colored QR code contains more than one valid QR codes. Hence, I utilize [stegsolve](https://github.com/zardus/ctf-tools/blob/master/stegsolve/install) to filter out valid QR codes and scan each of the QR code separately.

![image](/img/ctfs/wargamesmy2022-color-02.png) ![image](/img/ctfs/wargamesmy2022-color-03.png) ![image](/img/ctfs/wargamesmy2022-color-04.png)

-   blueplane.png: `5533b67bae8deb`
-   greenplane.png: `wgmy{a437a259`
-   redplane.png: `bac0f12d77}`

***FLAG***: `wgmy{a437a2595533b67bae8debbac0f12d77}`
