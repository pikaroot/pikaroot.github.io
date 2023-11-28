---
title: "Escape Room [Code Audit]"
categories: Acs2023
permalink: /ctfs/acs2023/escaperoom
---
Python Jail challenge.

## 📁 Challenge Description

> Can you escape?
>
> Connect to instance: `nc 192.168.0.45 53701`

```python
import os, sys

def main():
  filter_list = ['sys', 'import', 'flag', 'open', '/', "sh", "bin", 'eval', 'exec', 'os', 'read', 'system']

  print("Please Input your Source code > ")
  user_data = ''
  while True:
    temp = input()
    if(temp == 'EOF'):
      break

    user_data += temp + '\n'

  print(user_data)
  for filter_str in filter_list:
    if filter_str in user_data:
      print("No hack plz!")
      exit(0)

  binary = compile(user_data, '<string>', 'exec')
  
  os.close(0)
  os.close(1)
  exec(binary)

if __name__ == '__main__':
  
  main()
```

