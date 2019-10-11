let map = {
    '你好': '你也好',
    '你是谁': '你是谁',
    '你会说英语吗': '你会说英语吗'
};

module.exports = function getReply(k) {
    return map[k] || '呵呵';
};

