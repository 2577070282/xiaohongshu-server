const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
// 接收post过来的数据
// form data
app.use(bodyParser.urlencoded({ extended: true }));
// json
app.use(bodyParser.json());

// 解决跨域问题 CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE'); //设置方法
    next();
});
// 数据库连接
const mydb = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'data',
    port: 3306
});
mydb.connect();

//作者个人页面的侧边自己的笔记栏目
app.get('/discovery', (req, res) => {
    let sql = 'SELECT * from discovery';
    mydb.query(sql, function(err, results) {
        res.json(results);
    });

});
// profile页面的数据交互（主体内容部分的交互问题）
app.get('/profile', (req, res) => {
    let sql = 'SELECT * from `profile`';
    mydb.query(sql, function(err, results) {
        res.json(results);
    });
});

// 注册页面
app.post('/reg', function(req, res) {
    // 允许跨域：所有的操作都是跨域，难道每个路由里面都设置CORS吗？
    res.setHeader('Access-Control-Allow-Origin', '*');
    // 接收post过来的数据
    fdata = req.body;
    console.log(fdata);
    //操作数据保存到数据库
    let sql = 'INSERT INTO xhs(tel, password) VALUES (?,?)';
    mydb.query(sql, [fdata.tel, fdata.password], function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        res.json({ result: 'ok' }); //nodejs是非阻塞的 [{},{},{}]  {as:[{},{}]}   [1,2,3,4]
    })
});

// 登录页面
app.post('/signin', (req, res) => {
    console.log(req.body);
    // 检查账号是否存在
    let sql = 'SELECT * FROM xhs WHERE tel =? LIMIT 0, 1';
    let d = req.body;
    mydb.query(sql, [d.tel], function(err, result) {
        console.log(result);
        if (err) {
            console.log(err);
            return;
        }
        if (!result.length) {
            res.json({ r: 'tel_not_exist' });
            return;
        }
        //检查密码是否正确
        if (d.password != result[0].password) {
            res.json({ r: 'password_err' });
            return;
        }
        // 表示登录成功
        res.json({ r: 'success' });
    });
});

app.listen(7777, () => {
    console.log('Example app listening on port 7777!');
});