/// <reference path="./Scripts/typings/tsd.d.ts" />
import express = require('express');
//路由
import routes = require('./routes/index');
import socketctrl = require('./routes/socketctrl');
import user = require('./routes/userctrl');
//模块
import socketio = require('socket.io');
import path = require('path');
import mongoose = require('mongoose');
import compression = require('compression');
//express 4
import logger = require('morgan');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import favicon = require('serve-favicon');

import stylus = require('stylus');
import connect = require('connect');





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
app.post('/user/signup', user.signup);


// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
    var err:any = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var dbUrl = 'mongodb://localhost/netnote';
import session = require('express-session');
mongoose.connect(dbUrl, function (err: any) {
   
    const MongoStore = require('connect-mongo')(session);
    app.use(session({
        secret: 'netnote',
        store: new MongoStore({
            url: dbUrl,
            collection: "sessions",
        }),
        //https://github.com/expressjs/session/issues/56
        saveUninitialized: true,
        resave: true
    }));
    var server = app.listen(3000);
    //WebSocket处理
    socketio.listen(server).on('connection', socketctrl.socketlitener);
});


module.exports = app;









