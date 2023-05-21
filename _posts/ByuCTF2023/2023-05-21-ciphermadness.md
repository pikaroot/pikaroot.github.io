---
title: "Cipher Madness [CRYPTO]"
categories: ByuCTF2023
permalink: /ctfs/byuctf2023/ciphermadness
toc: true
toc_label: "cat ciphermadness.md"
toc_icon: "terminal"
---
Great guide on how to solve unknown ciphers in CTFs.

# Challenge 6: Compact [EASY]
209 points, 129 solves

## 📁 Challenge Description
>Apparently this is meant to replace the Latin alphabet??
>
>Flag format: `byuctf{word or phrase}` case insensitve.

[chall.png](https://cyberjousting.com/files/dc6a4ecbe2027ed6aa4812291da0f77d/chall.png?token=eyJ1c2VyX2lkIjoxMjA4LCJ0ZWFtX2lkIjo1OTMsImZpbGVfaWQiOjc0fQ.ZGpMSA.JxH1yNNOfyiyQm5QAKBSgLiI6Bw)

![compact.png](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/457bafe8-30ba-4d91-9d39-e2f5c099f1b8)

## 🚩 Solution

When we get an image file with patterns instead of texts under the cryptography category, we can attempt to discover the correct cipher via Google Lens (Google search by image).

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/d90b444e-6bed-490e-92e2-3aba24985097)

We found that this is **dotsies cipher**. The site has an alphabet system to decrypt the `chall.png`.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/5ed0da90-8c90-44f4-aae3-b8460d25aff5)

From here, we can get the `FLAG`.

***FLAG***: `byuctf{well its definitely more compact}`

# Challenge 7: 𐐗𐐡𐐆𐐑𐐓𐐄? [MEDIUM]
403 points, 75 solves

## 📁 Challenge Description
> Flag format: `byuctf{WORD_OR_PHRASE}`

[chall.png](https://cyberjousting.com/files/1372e8969c5c936140f5b85b7ec85b07/chall.png?token=eyJ1c2VyX2lkIjoxMjA4LCJ0ZWFtX2lkIjo1OTMsImZpbGVfaWQiOjcxfQ.ZGpOcQ.kxSMG9YncptwU61glkGxBtBLf1c)

![deseret.png](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/2cb31c29-39f9-466e-8c03-3f0529ce15a4)

## 🚩 Solution

Send the image to Google Lens. Sometimes, the results will not give positive outcomes. However, we can adjust the selected area to narrow the search.

By selecting the first half portion of `chall.png`, we get the similar pattern from the search results.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/4a6d8c37-c818-442c-b491-87c9467f86ba)

We found that this is something called **Deseret Alphabet**. After a quick search, we are able to find a [translator](https://www.2deseret.com/) to decrypt the ciphertext.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/ba046cbc-5854-469b-8893-455af32f911d)

Unluckily, the result does not go quite well as it gives the string: `be why you see tea f deseret means /h/u/n/ih/ /b/`.

By putting a little bit of creativity, we observed the pronounciation of the string is similar to `b y u c t f deseret means /h/u/n/ih/ /b/`. Great!

I solve the last part of the string by searching what deseret means LOL? (As I have zero knowledge about this challenge)

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/0c06a1be-c13f-402e-990f-0ea190371783)

It gives the result: `honeybee`. Sounds like a promising answer as the sound same as `/h/u/n/ih/ /b/`. 

From here, the `FLAG` can be constructed.

***FLAG***: `byuctf{deseret_means_honeybee}`

# Challenge 8: Poem [MEDIUM]
452 points, 53 solves

## 📁 Challenge Description
> `epcndkohlxfgvenkzcllkoclivdckskvpkddcyoceipkvrcslkdhycbcscwcsc`
> 
> Spaces and punctuation were removed :)
> 
> Flag format - `byuctf{the phrase goes here}` note there are spaces in the flag, no other punctuation needed.

## 🚩 Solution

We know the `FLAG` contains spaces but we don't know how many spaces and where the spaces should go.

```
epcndkohlxfgvenkzcllkoclivdckskvpkddcyoceipkvrcslkdhycbcscwcsc
```

After attempting a lot of online decoder and cryptographic tools, this [tool](https://quipqiup.com/) gives the most promising result.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/276fe7c9-b647-458b-bb20-08761314a473)

```
the flag is dbpc tf a message so clear a challenge to hackers a line were vere
```

Based on the phrase above, the `dbpc tf` maybe is pointing to the word `byuctf`. The word `byuctf` is not an actual word, causing the application to generate inconsistent result. 

Now, how about we insert the spaces as same as the first result.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/82d60dd8-a2fe-40a2-b962-4fb9e1c5f4e6)

```
the flag is bductf a message so clear a challenge to hackers a line vere were
```

Nice! Getting closer. Based on the phrase above, the last two words `vere were` looks weird. By looking for possible phrases, the phrase `we revere` should be the correct one.

The tool provides a clue placeholder with example inputs. This time, insert the input `xfgven=byuctf` to tell the application the correct substitution.

![image](https://github.com/pikaroot/pikaroot.github.io/assets/107750005/90edeb90-93fb-4886-9c60-e115a6f05595)

From here, we get the phrase of the `FLAG`.

***FLAG***: `byuctf{a message so clear a challenge to hackers a line we revere}`
