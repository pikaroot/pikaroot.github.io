---
title: "About Me"
layout: splash
permalink: /about/
header:
  overlay_color: "#000"
  overlay_filter: "0.5"
  overlay_image: /assets/images/unsplash-about.jpg
  cta_label: "GitHub"
  cta_url: "https://github.com/pikaroot/"
  caption: "Photo credit: Thimo Pedersen on [**Unsplash**](https://unsplash.com)"
excerpt: "Welcome to **PIKAROOT's** secret base. I am the best Pokémon you can find 
          on the internet. I am also part of the **M53**, the biggest CTF community 
          full of security experts in Malaysia."
intro:
  - excerpt: "Studied computer science specialized in cyber security in the past history.
              Now, I am currently working as a penetration tester and actively participating
              CTF competitions during my free time. I post writeups on CTF challenges, blogs,
              tutorials, and other general stuffs."
feature_row:
  - image_path: /assets/images/unsplash-blogs.jpg
    alt: "Blogs"
    title: "Blogs"
    excerpt: "Contains security blogs, articles, workshops, etc."
    btn_label: "Read Blogs"
    btn_class: "btn--inverse"
    url: "/blogs/"
  - image_path: /assets/images/unsplash-ctfs.jpg
    alt: "CTF Writeups"
    title: "CTF Writeups"
    excerpt: "Contains beginner to imtermediate level CTF challenges and solutions."
    url: "/ctfs/"
    btn_label: "Read Writeups"
    btn_class: "btn--inverse"
  - image_path: /assets/images/unsplash-cv.jpg
    title: "CV"
    excerpt: "This will keep here for a while, I'll just make a download button temporarily."
    url: "/cv/cv.pdf"
    btn_label: "Download CV"
    btn_class: "btn--inverse"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}
