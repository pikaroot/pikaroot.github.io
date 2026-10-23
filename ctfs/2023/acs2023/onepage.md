---
title: "One Page [CODE-AUDIT]"
description: "PHP Local File Inclusion to Remote Code Execution."
sidebar_position: 1
tags: ["code-audit"]
---

*November 24, 2023*

PHP Local File Inclusion to Remote Code Execution.

## Challenge Description

> Create your own webpage.
> 
> `http://192.168.0.52:40081`

Here are the challenge files that we need to audit.

```text
challenge
  ├── docker-compose.yml
  └── service
      ├── Dockerfile
      ├── app
      │   ├── application
      │   │   ├── controllers
      │   │   │   ├── errorController.php
      │   │   │   ├── indexController.php
      │   │   │   ├── pageController.php
      │   │   │   └── userController.php
      │   │   ├── core
      │   │   │   ├── bootstrap.php
      │   │   │   └── core.php
      │   │   ├── models
      │   │   │   ├── fileModel.php
      │   │   │   └── userModel.php
      │   │   ├── utils
      │   │   │   ├── template.php
      │   │   │   └── util.php
      │   │   └── views
      │   │       ├── index.tpl
      │   │       ├── login.tpl
      │   │       ├── page.tpl
      │   │       ├── register.tpl
      │   │       └── textarea.tpl
      │   ├── index.php
      │   ├── public
      │   │   ├── sample.css
      │   │   ├── sample.html
      │   │   └── sample.js
      │   └── user
      └── flag.txt
```

## Solution

We were given a simple web page that let users create a web page. 🤡

![image](/img/ctfs/acs2023-onepage-01.png)

After looking through the source code, the possible vulnerability that we found is located in the `application/controllers/pageController.php`.

```php
<?php

namespace Controllers;

class PageController {

    private $file;
    private $userData;
    private $util;
    public function __construct() {

        $this->util = new \utils\util();
        $this->file = new \models\fileModel();
        $this->userData = $_SESSION['userData'];
        if(!isset($this->userData)) $this->util->alertExit("Login Plz");
    }

    public function samplePage() {

        $this->file->copyFile(ROOT . 'public/sample.html', ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.html');
        $this->file->copyFile(ROOT . 'public/sample.js', ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.js');
        $this->file->copyFile(ROOT . 'public/sample.css', ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.css');
        $this->util->alertExit("Create Success");

    }

    public function viewPage() {

        $tpl = new \utils\template(VIEW . 'page.tpl');
        $tpl->render([
            "script" => './user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.js',
            "css" => './user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.css',
            "html" => $this->file->getFile(ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.html')
        ]);

    }

    public function edit() {

        if(!in_array($_REQUEST['type'], ['html', 'js', 'css'])) $this->util->alertExit("Invalid type");

        if($_SERVER['REQUEST_METHOD'] == 'POST'){

            $this->file->createFile(ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.' . $_POST['type'], $_POST['data']);
            $this->util->alertExit("Edit Success");
        }

        $tpl = new \utils\template(VIEW . 'textarea.tpl');
        $tpl->render(["type" => $_GET['type'], "data" => $this->file->getFile(ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.' . $_GET['type'])]);

    }

}
```

The `PageController` class consists of 3 functions, `samplePage()`, `viewPage()`, and `edit()`. We are only interested in the `edit()` function.

```php
public function edit() {

    if(!in_array($_REQUEST['type'], ['html', 'js', 'css'])) $this->util->alertExit("Invalid type");

    if($_SERVER['REQUEST_METHOD'] == 'POST'){

        $this->file->createFile(ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.' . $_POST['type'], $_POST['data']);
        $this->util->alertExit("Edit Success");
    }

    $tpl = new \utils\template(VIEW . 'textarea.tpl');
    $tpl->render(["type" => $_GET['type'], "data" => $this->file->getFile(ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.' . $_GET['type'])]);

}
```

In the `edit()` function, we can edit anything and save it in each `html`, `css`, and `js` tab. The vulnerability is the `$_REQUEST` method. The `$_REQUEST` method is a super global variable in PHP and it is used to collect data. Another interesting fact about the `$_REQUEST` method is that it is an associative array that holds `$_GET`, `$_POST`, and `$_COOKIE`.

We can get this information in Visual Studio Code when hover on the `$_REQUEST` method.

![image](/img/ctfs/acs2023-onepage-02.png)

What can we do with this?

Well. The `edit()` function doesn’t utilize the `$_COOKIE` method in the code. In other words, we can use `$_COOKIE` to bypass error checks.

The `$_GET` and `$_POST` methods are used in the code. Therefore, if we modify either of them, it will trigger an alert. However, if the `$_COOKIE` method holds the correct file type (`.html`, `.css`, or `.js`), it will bypass the check and doesn’t violate anything in the code.

Based on the concept above, we may get **Local File Inclusion** to **Remote Code Execution**.

We first *Create Sample Page* and go to edit *HTML* after logging in. I used `<?php echo shell_exec("whoami"); ?>` as my payload to test execution.

![image](/img/ctfs/acs2023-onepage-03.png)

Intercept the traffic with **Burp** when we save the HTML file. We wanted the server to save the file as `.php`.

From here, I modified it to `&type=php` in each line highlighted in the red boxes. Take note that it is necessary to add `;type=html` at the end of the *Cookie* header. We must keep it as `html` because the `$_REQUEST` method is checking the `$_COOKIE` method as well. As long as the server checks the `type=html` exists, it will be granted and ignore other modified fields.

![image](/img/ctfs/acs2023-onepage-04.png)

At first, we were concerned about how to leak the user’s UUID from the server, and it turns out that it can be found in the network inspector. The `.css` and `.js` files will be loaded every time the *View Page* is clicked. It leaked out the absolute path where the files were stored.

![image](/img/ctfs/acs2023-onepage-05.png)

This behavior can be found in the `viewPage()` function.

```php
public function viewPage() {

    $tpl = new \utils\template(VIEW . 'page.tpl');
    $tpl->render([
        "script" => './user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.js',
        "css" => './user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.css',
        "html" => $this->file->getFile(ROOT . 'user/' . $this->userData['uuid'] . '/' . $this->userData['uuid'] . '.html')
    ]);

}
```

Change the file extension to `.php` and we get the result `www-data`. The command inside the `.php` file is successfully executed from the server.

![image](/img/ctfs/acs2023-onepage-06.png)

Great! Now we can repeat the exploit process once again but modify the PHP payload. I used `../../../../../flag.txt` as it is the file location based on the challenge folder and it works the same when exploited remotely.

```php
<?php echo shell_exec("cat ../../../../../flag.txt"); ?>
```

From here, we can get the flag.

![image](/img/ctfs/acs2023-onepage-07.png)

PS: After the competition, we know that this challenge should be a **PHAR Deserialization Bug**, but we are still glad we found an unintended way to solve it. 🙂

*FLAG*: `ACS{b5932a3742f164d061f67996e41097c9}`
