---
title: "My Web notes [Notes]"
toc: true
toc_label: "cat contents.md"
toc_icon: "terminal"
---
Small things you need to know for the web category in CTF ~~I guess~~.

## URL Encoded and Decoded (Most used)

| Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|
| `space`   | %20     | `0`       | %30     |
| `!`       | %21     | `1`       | %31     |
| `"`       | %22     | `2`       | %32     |
| `#`       | %23     | `3`       | %33     |
| `$`       | %24     | `4`       | %34     |
| `%`       | %25     | `5`       | %35     |
| `&`       | %26     | `6`       | %36     |
| `'`       | %27     | `7`       | %37     |
| `(`       | %28     | `8`       | %38     |
| `)`       | %29     | `9`       | %39     |
| `*`       | %2A     | `:`       | %3A     |
| `+`       | %2B     | `;`       | %3B     |
| `,`       | %2C     | `<`       | %3C     |
| `-`       | %2D     | `=`       | %3D     |
| `.`       | %2E     | `>`       | %3E     |
| `/`       | %2F     | `?`       | %3F     |
| `_`       | %5F     | `@`       | %40     |

### Applications

```html
<!-- Example 1: XSS Common Payloads -->
<script>alert('XSS');</script>
javascript:alert('XSS');

<!-- Encoded results -->
%3Cscript%3Ealert%28%27XSS%27%29%3B%3C%2Fscript%3E
javascript%3Aalert%28%27XSS%27%29%3B
```

Updating...

## Meanings of Special Characters in a URL

Updating...

## References

1. [W3Schools - HTML URL Encoding References](https://www.w3schools.com/tags/ref_urlencode.ASP)
2. [URL Encode and Decode - Online](https://www.urlencoder.org/)
3. Updating...
