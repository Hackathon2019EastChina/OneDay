# OneDay

:camera_flash: 用全景记录你的生活

Table of Contents
=================

   * [OneDay](#oneday)
      * [<g-emoji class="g-emoji" alias="sparkles" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2728.png">✨</g-emoji>DEMO](#sparklesdemo)
      * [Innovation](#innovation)
      * [ScreenShots](#screenshots)
         * [Index](#index)
         * [Login/Register](#loginregister)
         * [Calendar](#calendar)
         * [Panorama](#panorama)
      * [Features](#features)
         * [User](#user)
         * [Administrator](#administrator)
      * [Development Environment](#development-environment)
      * [How to Run](#how-to-run)
      * [Project Structure](#project-structure)
      * [About the author](#about-the-author)

-----

## :sparkles:DEMO

:triangular_flag_on_post: :triangular_flag_on_post:请务必观看demo视频，辛苦您了～:triangular_flag_on_post::triangular_flag_on_post:

- [web端演示视频](https://pan.baidu.com/s/1oqb6vhalBmyekfr4tj2isQ)
- [mobile端演示视频](https://pan.baidu.com/s/1k2TOpsgU5quUAa-mohLVbA)
- [ppt转视频](https://pan.baidu.com/s/1BI5QljmhQFuKAjVO2iJblA)
  - **ppt请使用office365或PowerPoint2019打开**

------

## Innovation

从blog到vlog，人们记录生活的方式在不断丰富

OneDay —— 尝试从全新视角发现身边的美

:camera_flash: 用全景，记录生活

------

## ScreenShots

### Index

![image.png](https://upload-images.jianshu.io/upload_images/12014150-d82be40c8da251a1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Login/Register

![image.png](https://upload-images.jianshu.io/upload_images/12014150-66d659a39103d907.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Calendar

![image.png](https://upload-images.jianshu.io/upload_images/12014150-5139dea8062310ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Panorama

![image.png](https://upload-images.jianshu.io/upload_images/12014150-3cc7d6457f1fd246.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

------

## Features

### User

- 注册/登录
- 维护个人信息
- 以日历的形式查看生活记录
- 添加图片到指定日期
  - 支持多张图片进行全景图拼接
  - 支持单张全景图上传
  - VIP用户与普通用户有上传限制区分（但保证对普通用户的友好性）
- 查看某天的全景图
- 标记全景图中的事与物

### Administrator

- 管理上传图片
- 管理用户

------

## Development Environment

- **IDE:** Visual Studio Code 1.40.1
- **Languages:** 
  - python
  - HTML5
  - CSS3
  - JavaScript
- **Dependences:** 
  - eel
  - sqlite3
  - cv2
  - numpy

------

## How to Run

1. 运行`server/server.py`
2. 浏览器访问`localhost/index.html`
3. 根据功能介绍运行OneDay全景图像网站

------

## Project Structure

```
.
├── README.md
├── db
│   ├── OneDay.db
│   └── createDB.py
├── doc
│   └── OneDay_简要项目计划文档.pdf
├── server
│   ├── FullView.py
│   ├── __pycache__
│   │   ├── FullView.cpython-37.pyc
│   │   └── server.cpython-37.pyc
│   └── server.py
└── web
    ├── calendar.html
    ├── css
    │   ├── all.css
    │   ├── font-awesome.min.css
    │   ├── login.css
    │   └── style.css
    ├── homepage.html
    ├── img
    │   ├── bg.jpg
    │   └── tongji
    │       ├── 2019-10-21
    │       │   └── 2019-10-21.jpg
    │       ├── 2019-10-22
    │       │   └── 2019-10-22.jpg
    │       ├── 2019-10-23
    │       │   └── 2019-10-23.jpg
    │       └── 2019-10-24
    │           ├── 0.jpeg
    │           ├── 0_1.jpeg
    │           ├── 1.jpeg
    │           ├── 2.jpeg
    │           └── 2019-10-24.jpeg
    ├── index.html
    ├── js
    │   ├── Panorama.js
    │   ├── all.js
    │   ├── data.js
    │   ├── href.js
    │   ├── image.js
    │   ├── login.js
    │   ├── three.js
    │   └── tpanorama.js
    ├── login.html
    ├── panorama.html
    └── video
        └── leaves.mp4
```

------

## About the author

Tongji University

| Name                  | Email                |
| --------------------- | -------------------- |
| 张喆 \| Zhe Zhang     | doubleZ0108@163.com  |
| 吕雪飞 \| Xuefei Lv   | l_xuefei@outlook.com |
| 陈开昕 \| Kaixin Chen | 1536768420@qq.com    |

