import sqlite3
def create_db():
    conn = sqlite3.connect("test.db")
    # 创建游标
    c = conn.cursor()
    # 创建一个user表
    c.execute("CREATE TABLE user (user_name TEXT,user_password TEXT)")
    # 向user表中添加一条记录
    c.execute("INSERT INTO user (user_name,user_password) VALUES (?,?)",
                 ("tj", "123"))
    c.execute("INSERT INTO user (user_name,user_password) VALUES (?,?)",
                 ("tjmsc", "123"))
    # 创建一个tag表
    c.execute("CREATE TABLE tag (user_name TEXT, label TEXT)")
    # 提交事务
    conn.commit()
    # 获取user表中所有的记录
    c.execute("SELECT * FROM user")
    # 获取结果
    result = c.fetchall()
    # 关闭连接
    conn.close()
    # 查看数据
    print(result)

if __name__ == '__main__':
    create_db()