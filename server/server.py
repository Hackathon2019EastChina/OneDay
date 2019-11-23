'''
@program: server.py

@description:

@author: doubleZ

@create: 2019/11/20
'''

# coding: utf-8
import eel
import os, base64
import json
from base64 import b64decode
import numpy as np
import cv2
import sqlite3


dirname = '../web/img/'

eel.init('../web')


def mkdir(newpath):
    path = "../web/img/"+newpath
    folder = os.path.exists(path)
    if not folder:  # 判断是否存在文件夹如果不存在则创建为文件夹
        os.makedirs(path)  # makedirs 创建文件时如果路径不存在会创建这个路径
        print
        "---  new folder...  ---"
        print
        "---  OK  ---"
    else:
        print
        "---  There is this folder!  ---"


@eel.expose
def full_view(filename1, filename2):
    leftgray, rightgray = cv2.imread(dirname + filename1), cv2.imread(dirname + filename2)

    hessian = 400
    surf = cv2.xfeatures2d.SURF_create(hessian)         # 将Hessian Threshold设置为400,阈值越大能检测的特征就越少
    kp1, des1 = surf.detectAndCompute(leftgray, None)   # 查找关键点和描述符
    kp2, des2 = surf.detectAndCompute(rightgray, None)

    FLANN_INDEX_KDTREE = 0  # 建立FLANN匹配器的参数
    indexParams = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)  # 配置索引，密度树的数量为5
    searchParams = dict(checks=50)  # 指定递归次数
    # FlannBasedMatcher：是目前最快的特征匹配算法（最近邻搜索）
    flann = cv2.FlannBasedMatcher(indexParams, searchParams)  # 建立匹配器
    matches = flann.knnMatch(des1, des2, k=2)  # 得出匹配的关键点

    good = []
    # 提取优秀的特征点
    for m, n in matches:
        # if m.distance < 0.7 * n.distance:  # 如果第一个邻近距离比第二个邻近距离的0.7倍小，则保留
        if m.distance < 0.3 * n.distance:
            good.append(m)
    src_pts = np.array([kp1[m.queryIdx].pt for m in good])  # 查询图像的特征描述子索引
    dst_pts = np.array([kp2[m.trainIdx].pt for m in good])  # 训练(模板)图像的特征描述子索引
    H = cv2.findHomography(src_pts, dst_pts)  # 生成变换矩阵

    h, w = leftgray.shape[:2]
    h1, w1 = rightgray.shape[:2]
    shft = np.array([[1.0, 0, w], [0, 1.0, 0], [0, 0, 1.0]])
    M = np.dot(shft, H[0])  # 获取左边图像到右边图像的投影映射关系

    dst_corners = cv2.warpPerspective(leftgray, M, (w * 2, h))  # 透视变换，新图像可容纳完整的两幅图
    # cv2.imshow('before add right', dst_corners)
    # dst_corners[0:h, 0:w] = leftgray
    dst_corners[0:h, w:w+w1] = rightgray  # 将第二幅图放在右侧

    # 删除空白列
    sum_col = np.sum(np.sum(dst_corners, axis=0), axis=1)
    for i in range(len(sum_col)):
        if sum_col[i] != 0:
            dst_corners = dst_corners[:, i:]
            break

    # cv2.imshow('dest', dst_corners)
    cv2.imwrite(dirname + 'tiled.jpg', dst_corners)

    cv2.waitKey()
    cv2.destroyAllWindows()


@eel.expose
def get_origin_img(filename, img):
    '''处理数据(储存)'''
    with open(dirname + filename, 'wb') as f:
        # 将base64格式的数据解码成二进制数据并写入文件
        f.write(b64decode(img))
    print('图片' + filename + '已保存')


@eel.expose
def add_tag(UserDateLabel):
    conn = sqlite3.connect("../db/OneDay.db")
    # 创建游标
    c = conn.cursor()
    # 插入label
    c.execute("INSERT INTO tag (user_name,date,label) VALUES (?,?,?)",
              (UserDateLabel["user"], UserDateLabel["date"], UserDateLabel["label"]))
    # 提交事务
    conn.commit()
    # 关闭连接
    conn.close()


@eel.expose
def read_panorama(UserDate):
    conn = sqlite3.connect("../db/OneDay.db")
    # 创建游标
    c = conn.cursor()
    # 读取数据
    c.execute("SELECT label FROM tag WHERE user_name = \'" + UserDate["user"] + "\'" + "AND date = \'" +UserDate["date"] + "\'")
    result1 = c.fetchall()
    c.close()
    # 创建游标
    c = conn.cursor()
    # 读取数据
    c.execute("SELECT description, path FROM panorama WHERE user_name = \'" + UserDate["user"] + "\'" + "AND date = \'" +UserDate["date"] + "\'")
    result2 = c.fetchone()
    result = {'path': result2[1], 'description': result2[0], 'label': result1}
    c.close()
    return result


@eel.expose
def add_panorama(UserDateImgnameImgsrcDesc):
    newpath = UserDateImgnameImgsrcDesc['user']+"/"+UserDateImgnameImgsrcDesc['date']
    mkdir(newpath)
    imgdata = base64.b64decode(UserDateImgnameImgsrcDesc["imgsrc"])
    file = open("../web/img/"+newpath+"/"+ UserDateImgnameImgsrcDesc['date'] + "."+ UserDateImgnameImgsrcDesc['imgname']
                .split('.')[1] , 'wb')
    file.write(imgdata)
    file.close()

    conn = sqlite3.connect("../db/OneDay.db")
    # 创建游标
    c = conn.cursor()
    # 插入UserDataImgnameImgsrc
    c.execute("INSERT INTO panorama (user_name,date,path,description) VALUES (?,?,?,?)",
              (UserDateImgnameImgsrcDesc["user"], UserDateImgnameImgsrcDesc["date"], newpath+"/"+
               UserDateImgnameImgsrcDesc['date'] + "."+ UserDateImgnameImgsrcDesc['imgname'].split('.')[1], UserDateImgnameImgsrcDesc["description"]))
    # 提交事务
    conn.commit()
    # 关闭连接
    conn.close()


@eel.expose
def register(UserPwd):
    conn = sqlite3.connect("../db/OneDay.db")
    # 创建游标
    c = conn.cursor()
    c.execute("SELECT EXISTS(SELECT user_name FROM user WHERE user_name= \'"+UserPwd["username"]+"\')")
    state = {'state': False}
    if(c.fetchone()):
        return state
    # 插入User
    c.execute("INSERT INTO user (user_name,password) VALUES (?,?)",
              UserPwd["username"], UserPwd["password"])
    # 提交事务
    conn.commit()
    # 关闭连接
    conn.close()
    state['state'] = True
    return state


@eel.expose
def login(UserPwd):
    conn = sqlite3.connect("../db/OneDay.db")
    # 创建游标
    c = conn.cursor()
    c.execute("SELECT EXISTS(SELECT user_name FROM user WHERE user_name= \'"+UserPwd["username"]+"\' AND password= \'"+
              UserPwd["password"] + "\')")
    state = {'state': False}
    if not c.fetchone():
        return state
    else:
        state['state'] = True
        return state


if __name__ == '__main__':
    eel.start('homepage.html')
    # full_view('test1.jpeg', 'test2.jpeg')
    # full_view('true1.jpg', 'true2.jpg')
    # full_view('room1.jpg', 'room2.jpg')
