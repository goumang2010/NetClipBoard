var iosocket = io.connect();
function socket_connect() {
    iosocket.on('connect', function () {
        $('#state').append($('<li>已连接！</li>'));
        iosocket.on('message', function (message) {
            $('#chatText').append($('<li></li>').text(message));
        });
        iosocket.on('disconnect', function () {
            $('#state').append('<li>失去连接</li>');
        });
    });
}
//提交聊天消息内容
function sendMsg() {
    var content = $('#chatText').val();
    if (content != '') {
        //var obj = {
        //    userid: this.userid,
        //    username: this.username,
        //    content: content
        //};
        iosocket.emit('message', content);
        $('#chatText').val('');
    }
    return false;
}
socket_connect();
//# sourceMappingURL=websocket.js.map