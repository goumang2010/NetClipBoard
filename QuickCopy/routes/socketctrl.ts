import express = require('express');
import method = require('./sharedmethod');

export function websocket(req: express.Request, res: express.Response) {
    req.cookies = method.parseCookie(req.headers["cookie"]);
    if (req.cookies.socketuser==undefined) {
        res.render('websocket', { sysmsg: '欢迎第一次到来', year: new Date().getFullYear() });
    }
    else {
        res.render('websocket', { sysmsg: '欢迎再次到来', year: new Date().getFullYear() });
    }

};
// Chatroom

var numUsers = 0;
var Users: string[]=[];
var removeUser = function (username) {
    var ind = Users.indexOf(username);
    if (ind >= 0) {
        Users.splice(ind, 1);
    }
    
}
export function socketlitener(socket:SocketIO.Socket) {
    socket.on('message', function (msg) {
        console.log('接受到 ', msg);
        //将信息发送给其他客户端
        //socket.broadcast.emit('message', msg);
    });
    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });
    socket.on('check user', function (username: string) {
        if (username&&Users.indexOf(username) < 0) {
            socket.emit('user status', {
                username: username,
                status: "OK",
            });
        }
        else {
            socket.emit('user status', {
                staus: "Name Repeat",
            });
        }


    });
    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username:string) {
        if (addedUser) return;

        // we store the username in the socket session for this client
       
        socket.username = username;
        ++numUsers;
        Users.push(username);
        addedUser = true;

        socket.emit('login', {
            numUsers: numUsers,
            usersNow: Users
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;
            removeUser(socket.username);

            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });
}