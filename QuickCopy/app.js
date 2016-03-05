"use strict";
/// <reference path="./Scripts/typings/tsd.d.ts" />
var express = require('express');
//路由
var routes = require('./routes/index');
var socketctrl = require('./routes/socketctrl');
var user = require('./routes/userctrl');
//模块
var socketio = require('socket.io');
var path = require('path');
var mongoose = require('mongoose');
var compression = require('compression');
//express 4
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var stylus = require('stylus');
var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression()); //use compression 
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
var dbUrl = 'mongodb://localhost/netnote';
var session = require('express-session');
mongoose.connect(dbUrl, function (err) {
    var MongoStore = require('connect-mongo')(session);
    app.use(session({
        secret: 'netnote',
        store: new MongoStore({
            url: dbUrl,
            collection: "sessions"
        }),
        //https://github.com/expressjs/session/issues/56
        saveUninitialized: true,
        resave: true
    }));
    //app.use(app.router);
    app.get('/', routes.index);
    app.get('/about', routes.about);
    app.get('/contact', routes.contact);
    //WenbSocket页面
    app.get('/websocket', socketctrl.websocket);
    //增加note
    app.post('/addnote', routes.addnote);
    //通过get取得note
    app.get('/fetch', routes.fetch);
    //通过ajax取得note
    app.post('/ajaxfetch', routes.ajaxfetch);
    //注册
    app.post('/signup', user.signup);
    //登录
    app.post('/signin', user.signin);
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // error handlers
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    var server = app.listen(3000);
    //WebSocket处理
    socketio.listen(server).on('connection', socketctrl.socketlitener);
});
module.exports = app;
