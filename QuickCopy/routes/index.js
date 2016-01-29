var noteraw = require('../Models/noteModel');
var method = require('./sharedmethod');
var Note = noteraw;
function index(req, res) {
    res.render('index', { title: 'NetClipBoard', year: new Date().getFullYear() });
}
exports.index = index;
;
function about(req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
}
exports.about = about;
;
function contact(req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
}
exports.contact = contact;
;
function ajaxfetch(req, res) {
    //console.log("start");
    var key = req.query.key;
    var keystr = key;
    if (keystr.length == 6) {
        // var array = [keystr.substr(0, 2), keystr.substr(2, 2), keystr.substr(4, 2)];
        //var re = new RegExp(".{6}" + array[0] + ".{4}" + array[1] + ".{8}" + array[2]);
        // res.write("test");
        Note.findOne({ "fetchKey": keystr }, function (err, bsonres) {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                var text = bsonres.get("noteText");
                res.write(text);
                res.end();
            }
        });
    }
    else {
        res.end();
    }
}
exports.ajaxfetch = ajaxfetch;
;
function fetch(req, res) {
    var key = req.query.key;
    var keystr = key;
    if (keystr.length == 6) {
        Note.findOne({ "fetchKey": keystr }, function (err, bsonres) {
            if (err) {
                console.log(err);
                res.end();
            }
            else {
                var text = bsonres.get("noteText");
                res.render('index', { title: 'NetClipBoard', year: new Date().getFullYear(), noteText: text });
            }
        });
    }
    else {
        res.end();
    }
}
exports.fetch = fetch;
;
function addnote(req, res) {
    var note = req.body.noteText;
    if (note !== '') {
        // console.log(_dict);
        var newtext = new Note({ noteText: note, userIP: method.getClientIp(req) });
        var keyraw = newtext.get("_id");
        var key = String(keyraw);
        var trimkey = key.substr(6, 2) + key.substr(12, 2) + key.substr(22, 2);
        newtext.set("fetchKey", trimkey);
        newtext.save(function (err, note) {
            if (err) {
                console.log(err);
                console.log(note);
            }
        });
        res.write(trimkey);
        res.end();
        console.log(newtext.errors);
        console.log("undefined is false");
    }
    else {
        res.end();
        console.log("undefined is true");
    }
}
exports.addnote = addnote;
;
//# sourceMappingURL=index.js.map