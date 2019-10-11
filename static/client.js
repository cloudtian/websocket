let $msg = document.querySelector('.msg');
let $btn = document.querySelector('.btn');
let $content = document.querySelector('.content');
let $connect = document.querySelector('.connect'); 
let $close = document.querySelector('.close'); 

let host = 'localhost';
let port = 9090;

let Socket;
let $currentUl;

$connect.onclick = function () {
    if (!window.WebSocket) {
        alert('您的浏览器不支持WebSocket!');
        return;
    }

    Socket = new WebSocket(`ws://${host}:${port}/message`);

    Socket.onopen = function () {
        alert('连接成功');
        insertMsg('已进入', true);
    }

    Socket.onmessage = function (e) {
        insertMsg(e.data);
    }

    Socket.onerror = function () {
        alert('发生错误');
    }

    Socket.onclose = function () {
        alert('连接关闭');
        insertMsg('已退出', false);
        Socket = null;
    }
}

$close.onclick = function () {
    Socket.close();
}

$btn.onclick = function () {
    let message = $msg.value;
    if (!message) {
        alert('请输入内容后再提交！');
        return;
    }

    if (!Socket || Socket.readyState !== 1) {
        alert('未正常连接，请稍后重试！');
        return;
    }

    Socket.send(message);
    insertMsg(message);
    $msg.textContent = '';
}

function insertMsg(message, isEnter) {
    let span = document.createElement('span');
    span.textContent = message;

    if (typeof isEnter !== 'undefined') {
        span.classList += 'tip';
        $content.appendChild(span);
       
        if (isEnter) {
            $currentUl = document.createElement('ul');
            $content.appendChild($currentUl);
        }

        return;
    }

    let li = document.createElement('li');
    li.appendChild(span);
    $currentUl.appendChild(li);
}
