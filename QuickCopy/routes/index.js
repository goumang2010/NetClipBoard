var noteraw = require('../Models/noteModel');
var Note = noteraw;
function index(req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
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
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
;
function addnote(req, res) {
    var note = req.body.noteText;
    if (note !== 'undefined') {
        // console.log(_dict);
        var newtext = new Note({ noteText: note, userIP: getClientIp(req) });
        newtext.save(function (err, note) {
            if (err) {
                console.log(err);
            }
        });
        //Return the url to generate QR
        var qrpath = req.url + "?fetchID=" + newtext.get("_id");
        res.write(qrpath);
        res.end();
        console.log(newtext.get("_id"));
        console.log("undefined is true");
    }
    else {
        console.log("undefined is false");
    }
}
exports.addnote = addnote;
;
//# sourceMappingURL=index.js.map