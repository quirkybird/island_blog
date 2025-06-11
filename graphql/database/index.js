const mysql = require("mysql2");
const config = require("./config");

// 创建连接池
const pool = mysql.createPool(config);

// 查看是否连接成功
pool.getConnection((err, connection) => {
  if (err) {
    console.log("数据库连接失败~", err);
    return;
  }
  console.log("数据库连接成功~");
  // 释放连接
  connection.release();
});

module.exports = pool.promise();
