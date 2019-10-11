let express = require('express');
let app = express();
let conversion = require('./conversition');
let opn = require('opn');
let address = require('address');
require('express-ws')(app);

let port = 9090;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('index.html');
});
app.use(express.static('static'))
app.listen(port, () => console.log(`Example app listening on port ${port}`));

app.ws('/message', function (ws, req) {
    ws.on('open', function (e) {
        console.log('[server]连接成功');
    });
    ws.on('error', function () {
        console.log('[server]连接失败');
    });
    ws.on('close', function () {
        console.log('[server]连接关闭');
    });
    ws.on('message', (msg) => {
        console.log('[server]收到消息', msg);
        ws.send(conversion(msg), (err) => {
            if (err) {
                console.log('[server]出错', err)
            }
        });
    });
});

// 自动打开浏览器
opn(`http://${address.ip()}:${port}`);