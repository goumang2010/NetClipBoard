import express = require('express');
//路由
import routes = require('./routes/index');
import socketctrl = require('./routes/socketctrl');
import user = require('./routes/userctrl');
//模块
import socketio = require('socket.io');
import http = require('http');
import path = require('path');
import mongoose = require('mongoose');
import compression = require('compression');
const MongoStore = require('connect-mongo')(express);
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
app.use(express.cookieParser());

import stylus = require('stylus');
app.use(compression()); //use compression 
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({
    secret: 'netnote',
    store: new MongoStore({
        url: dbUrl,
        collection: "sessions"
    })
}));
app.use(app.router);
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
//增加note
app.post('/addnote', routes.addnote);
//通过get取得note
app.get('/fetch', routes.fetch);
//通过ajax取得note
app.post('/ajaxfetch', routes.ajaxfetch);
//注册
app.post('/user/signup', user.signup);


var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



//WebSocket处理
socketio.listen(server).on('connection', socketctrl.socketlitener);






