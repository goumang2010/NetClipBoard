var noteraw = require('../Models/noteModel');
var Note = noteraw;
function index(req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
}
exports.index = index;
;
function about(req, res) {
    //  console.log(req.headers);
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
}
exports.about = about;
;
function contact(req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
}
exports.contact = contact;
;
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
;
function fetch(req, res) {
    res.write("mock");
    res.end();
}
exports.fetch = fetch;
;
function addnote(req, res) {
    var note = req.body.noteText;
    if (note !== '') {
        // console.log(_dict);
        var newtext = new Note({ noteText: note, userIP: getClientIp(req) });
        newtext.save(function (err, note) {
            if (err) {
                console.log(err);
                console.log(note);
            }
        });
        //Return the url to generate QR
        var keyraw = newtext.get("_id");
        var key = String(keyraw);
        var trimkey = key.substr(6, 2) + key.substr(12, 2) + key.substr(22, 2);
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