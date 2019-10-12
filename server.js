let express = require('express');
let app = express();
let conversion = require('./conversition');
let opn = require('opn');
let address = require('address');
let expressWs = require('express-ws')(app);


let port = 9090;

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('index.html');
});
app.get('/multi', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendfile('multi.html');
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

let count = 0;
app.ws('/multi', function (ws, req) {
    count++;
    ws.username = req.query.username;
    sendMsgToAll(ws, JSON.stringify({
        username: ws.username,
        enter: true,
        count 
    }));
    ws.on('error', function () {
        console.log('[server]连接失败');
    });
    ws.on('close', function () {
        count--;
        console.log('[server]连接关闭');
        sendMsgToAll(ws, JSON.stringify({
            username: ws.username,
            enter: false,
            count 
        }));
    });
    ws.on('message', (msg) => {
        
        console.log(`[server]收到消息来自${ws.username}`, msg);

        sendMsgToAll(ws, JSON.stringify({
            username: ws.username,
            msg,
            count
        }));
    });
});


// ws当前websocket,content要发送的内容
function sendMsgToAll(ws, content) {
    expressWs.getWss().clients.forEach((v) => {
        v.send(content);
    });
}

// 自动打开浏览器
opn(`http://${address.ip()}:${port}/multi`);