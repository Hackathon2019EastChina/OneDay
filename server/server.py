'''
@program: server.py

@description: 

@author: doubleZ

@create: 2019/11/20 
'''

# coding: utf-8
import eel

from base64 import b64decode
import numpy as np
import cv2

dirname = '../web/img/'

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
        if m.distance < 0.7 * n.distance:  # 如果第一个邻近距离比第二个邻近距离的0.7倍小，则保留
            good.append(m)
    src_pts = np.array([kp1[m.queryIdx].pt for m in good])  # 查询图像的特征描述子索引
    dst_pts = np.array([kp2[m.trainIdx].pt for m in good])  # 训练(模板)图像的特征描述子索引
    H = cv2.findHomography(src_pts, dst_pts)  # 生成变换矩阵

    h, w = leftgray.shape[:2]
    h1, w1 = rightgray.shape[:2]
    shft = np.array([[1.0, 0, w], [0, 1.0, 0], [0, 0, 1.0]])
    M = np.dot(shft, H[0])  # 获取左边图像到右边图像的投影映射关系
    dst_corners = cv2.warpPerspective(leftgray, M, (w * 2, h))  # 透视变换，新图像可容纳完整的两幅图
    dst_corners[0:h, w:w * 2] = rightgray  # 将第二幅图放在右侧
    dst_corners = dst_corners[:, 100:]

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



if __name__ == '__main__':

    eel.init('../web')

    eel.start('homepage.html')
