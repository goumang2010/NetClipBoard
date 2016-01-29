﻿import express = require('express');
import routes = require('./routes/index');
import socketctrl = require('./routes/socketctrl');
import socketio = require('socket.io');
import http = require('http');
import path = require('path');
import mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/netnote'
mongoose.connect(dbUrl)


var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    //db.on('error', function (error) {
    //    console.log(error);
    //}); 
    //mongoose.set('debug', true);
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
//WenbSocket页面
app.get('/websocket', socketctrl.websocket);
app.post('/addnote', routes.addnote);
app.get('/fetch', routes.fetch);
app.get('/ajaxfetch', routes.ajaxfetch);

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



//WebSocket处理
socketio.listen(server).on('connection', socketctrl.socketlitener);




