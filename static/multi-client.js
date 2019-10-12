let $msg = document.querySelector('.msg');
let $btn = document.querySelector('.btn');
let $content = document.querySelector('.content');
let $connect = document.querySelector('.connect'); 
let $close = document.querySelector('.close'); 
let $name = document.querySelector('.name');
let $userCount = document.querySelector('.user-count');

let host = 'localhost';
let port = 9090;

let Socket;
let $currentUl;
let username;
let userCount = 0;

$connect.onclick = function () {
    if (!window.WebSocket) {
        alert('您的浏览器不支持WebSocket!');
        return;
    }
    
    if (!$name.value) {
        alert('请先输入昵称!');
        return;
    }

    username = $name.value;

    Socket = new WebSocket(`ws://${host}:${port}/multi?username=${username}`);

    Socket.onopen = function () {
        alert('连接成功');
        insertMsg(username, true);
    }

    Socket.onmessage = function (e) {
        let data = JSON.parse(e.data);

        if (userCount !== data.count) {
            userCount = data.count;
            updateUserCount();
        }

        if (username === data.username) {
            return;
        }
        // 如果是别人进入或退出的消息
        if (typeof data.enter !== 'undefined') {
            insertMsg(data.username, data.enter);
        } else {
            insertMsg(data);
        }        
    }

    Socket.onerror = function () {
        alert('发生错误');
    }

    Socket.onclose = function () {
        alert('连接关闭');
        insertMsg(username, false);
        Socket = null;
        username = '';
        userCount = 0;
        updateUserCount();
    }
}

$close.onclick = function () {
    Socket.close();
}

$btn.onclick = function () {
    if (!Socket || Socket.readyState !== 1) {
        alert('请先进入聊天室！');
        return;
    }

    let message = $msg.value;
    if (!message) {
        alert('请输入内容后再提交！');
        return;
    }

    Socket.send(message);
    insertMsg(message);
}

// isEnter是否进入聊天室，true则为进入消息，false则为退出消息，不传入则是对话消息
function insertMsg(data, isEnter) {
    if (!$currentUl) {
        $currentUl = document.createElement('ul');
        $content.appendChild($currentUl);
    }

    let msg = typeof data === 'string' ? data : data.msg;

    if (typeof isEnter !== 'undefined') {
        insertTip(msg, isEnter);
        return;
    }

    // 即自己说的话
    if (typeof data === 'string' || data.username === username) {
        insertOwnMsg(msg);
    } else {
        insertOtherMsg(data);
    }
}

// 本机的消息
function insertOwnMsg (msg) {
    let li = document.createElement('li');
    li.classList += 'own msg';
    let span = document.createElement('span');
    span.textContent = msg;
    span.classList += 'text'
    li.appendChild(span);
    $currentUl.appendChild(li);
}

// 其他的消息
function insertOtherMsg (data) {
    let li = document.createElement('li');
    li.classList += 'msg';
    let span1 = document.createElement('span');
    let span2 = document.createElement('span');
    span1.textContent = `${data.username}：`;
    span1.classList += 'name';
    span2.textContent = data.msg;
    span2.classList += 'text'; 
    li.appendChild(span1);
    li.appendChild(span2);
    $currentUl.appendChild(li);
}

// 提示消息
function insertTip (msg, isEnter) {
    let li = document.createElement('li');
    let span = document.createElement('span');
    span.textContent = msg + (isEnter ? '已进入' : '已退出');
    li.classList += 'tip';
    li.appendChild(span);
    $currentUl.appendChild(li);
}

function updateUserCount() {
    $userCount.textContent = userCount;
}