---
title: "Cipher Madness [CRYPTO]"
description: "Great guide on how to solve unknown ciphers in CTFs."
sidebar_position: 2
tags: ["crypto"]
---

*May 21, 2023*

Great guide on how to solve unknown ciphers in CTFs.

## Challenge 6: Compact (Easy)

209 points, 129 solves

### Challenge Description

> Apparently this is meant to replace the Latin alphabet??
> 
> Flag format: `byuctf{word or phrase}` case insensitve.

[chall.png](https://cyberjousting.com/files/dc6a4ecbe2027ed6aa4812291da0f77d/chall.png?token=eyJ1c2VyX2lkIjoxMjA4LCJ0ZWFtX2lkIjo1OTMsImZpbGVfaWQiOjc0fQ.ZGpMSA.JxH1yNNOfyiyQm5QAKBSgLiI6Bw)

![compact.png](/img/ctfs/byuctf2023-ciphermadness-01.png)

### Solution

When we get an image file with patterns instead of texts under the cryptography category, we can attempt to discover the correct cipher via Google Lens (Google search by image).

![image](/img/ctfs/byuctf2023-ciphermadness-02.png)

We found that this is **dotsies cipher**. The site has an alphabet system to decrypt the `chall.png`.

![image](/img/ctfs/byuctf2023-ciphermadness-03.png)

From here, we can get the `FLAG`.

***FLAG***: `byuctf{well its definitely more compact}`

## Challenge 7: 𐐗𐐡𐐆𐐑𐐓𐐄? (Medium)

403 points, 75 solves

### Challenge Description

> Flag format: `byuctf{WORD_OR_PHRASE}`

[chall.png](https://cyberjousting.com/files/1372e8969c5c936140f5b85b7ec85b07/chall.png?token=eyJ1c2VyX2lkIjoxMjA4LCJ0ZWFtX2lkIjo1OTMsImZpbGVfaWQiOjcxfQ.ZGpOcQ.kxSMG9YncptwU61glkGxBtBLf1c)

![deseret.png](/img/ctfs/byuctf2023-ciphermadness-04.png)

### Solution

Send the image to Google Lens. Sometimes, the results will not give positive outcomes. However, we can adjust the selected area to narrow the search.

By selecting the first half portion of `chall.png`, we get the similar pattern from the search results.

![image](/img/ctfs/byuctf2023-ciphermadness-05.png)

We found that this is something called **Deseret Alphabet**. After a quick search, we are able to find a [translator](https://www.2deseret.com/) to decrypt the ciphertext.

![image](/img/ctfs/byuctf2023-ciphermadness-06.png)

Unluckily, the result does not go quite well as it gives the string: `be why you see tea f deseret means /h/u/n/ih/ /b/`.

By putting a little bit of creativity, we observed the pronounciation of the string is similar to `b y u c t f deseret means /h/u/n/ih/ /b/`. Great!

I solve the last part of the string by searching what deseret means LOL? (As I have zero knowledge about this challenge)

![image](/img/ctfs/byuctf2023-ciphermadness-07.png)

It gives the result: `honeybee`. Sounds like a promising answer as the sound same as `/h/u/n/ih/ /b/`.

From here, the `FLAG` can be constructed.

***FLAG***: `byuctf{deseret_means_honeybee}`

## Challenge 8: Poem (Medium)

452 points, 53 solves

### Challenge Description

> `epcndkohlxfgvenkzcllkoclivdckskvpkddcyoceipkvrcslkdhycbcscwcsc`
> 
> Spaces and punctuation were removed :)
> 
> Flag format - `byuctf{the phrase goes here}` note there are spaces in the flag, no other punctuation needed.

### Solution

We know the `FLAG` contains spaces but we don’t know how many spaces and where the spaces should go.

```text
epcndkohlxfgvenkzcllkoclivdckskvpkddcyoceipkvrcslkdhycbcscwcsc
```

After attempting a lot of online decoders and cryptographic tools, this [tool](https://quipqiup.com/) gives the most possible result.

![image](/img/ctfs/byuctf2023-ciphermadness-08.png)

```text
the flag is dbpc tf a message so clear a challenge to hackers a line were vere
```

Based on the phrase above, the `dbpc tf` maybe is pointing to the word `byuctf`. The word `byuctf` is not an actual word, causing the application to generate inconsistent result.

Now, how about we insert the spaces as same as the first result.

![image](/img/ctfs/byuctf2023-ciphermadness-09.png)

```text
the flag is bductf a message so clear a challenge to hackers a line vere were
```

Nice! Getting closer. Based on the phrase above, the last two words `vere were` looks weird. By looking for possible combinations, the phrase `we revere` should be the correct one.

The tool provides a clue placeholder with example inputs. This time, insert the input `xfgven=byuctf` to tell the application the correct substitution.

![image](/img/ctfs/byuctf2023-ciphermadness-10.png)

From here, we get the correct phrase of the `FLAG`.

***FLAG***: `byuctf{a message so clear a challenge to hackers a line we revere}`
