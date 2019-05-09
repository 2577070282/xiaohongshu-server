const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
// 接收post过来的数据
// form data
app.use(bodyParser.urlencoded({extended: true}));
// json
app.use(bodyParser.json());

// 解决跨域问题 CORS
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');//设置方法
    next();
}); 
// 数据库连接
const mydb = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'xhs',
    port:3306
});
mydb.connect();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/newslist',function(req,res){
    let sql = 'SELECT * from newslists ';
    // [req.query.year],
    mydb.query(sql, function(err, results){
        res.json(results);
    });
// res.send('123');
})
app.listen(7777, () => {
    console.log('Example app listening on port 7777!');
});

