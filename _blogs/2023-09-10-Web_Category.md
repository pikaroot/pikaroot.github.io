---
title: "My Web notes [Notes]"
toc: true
toc_label: "cat contents.md"
toc_icon: "terminal"
---
Small things you need to know for the web category in CTF ~~I guess~~.

## URL Encoded and Decoded (Most used)

| Character | Encoded | Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|-----------|---------|
| `space`   | %20     | `%`       | %25     | `*`       | %2A     |
| `!`       | %21     | `&`       | %26     | `+`       | %2B     |
| `"`       | %22     | `'`       | %27     | `,`       | %2C     |
| `#`       | %23     | `(`       | %28     | `-`       | %2D     |
| `$`       | %24     | `)`       | %29     | `.`       | %2E     |
|           |         | `_`       | %5F     | `/`       | %2F     |

| Character | Encoded | Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|-----------|---------|
| `0`       | %30     | `5`       | %35     | `:`       | %3A     |
| `1`       | %31     | `6`       | %36     | `;`       | %3B     |
| `2`       | %32     | `7`       | %37     | `<`       | %3C     |
| `3`       | %33     | `8`       | %38     | `=`       | %3D     |
| `4`       | %34     | `9`       | %39     | `>`       | %3E     |
|           |         | `@`       | %40     | `?`       | %3F     |

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
