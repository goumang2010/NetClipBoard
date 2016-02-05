var express = require('express');
//路由
var routes = require('./routes/index');
var socketctrl = require('./routes/socketctrl');
var user = require('./routes/user');
//模块
var socketio = require('socket.io');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var compression = require('compression');
var MongoStore = require('connect-mongo')(express);
var dbUrl = 'mongodb://localhost/netnote';
mongoose.connect(dbUrl);
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
var stylus = require('stylus');
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
//# sourceMappingURL=app.js.map