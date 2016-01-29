import express = require('express');
import method = require('./sharedmethod');

export function websocket(req: express.Request, res: express.Response) {
    req.cookies = method.parseCookie(req.headers["cookie"]);
    
    if (!req.cookies.isVisit) {
        res.setHeader('Set-Cookie', method.serialize('isVisit', '1'));
        res.render('websocket', { sysmsg: '欢迎第一次到来' });
    }
    else {
        res.render('websocket', { sysmsg: '欢迎再次到来' });
    }

};

export function socketlitener(socket) {
    socket.on('message', function (msg) {
        console.log('接受到 ', msg);
        //将信息发送给其他客户端
        //socket.broadcast.emit('message', msg);
    });
}