var userraw = require('../Models/userModel');
var User = userraw;
function signup(req, res) {
    var _user = req.body;
    var user = new User({ name: _user.name, password: _user.password, email: _user.email });
    // console.log(user);
    user.save(function (err, user_saved) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(user_saved);
            //write cookie and session
            req.session.userinfo = user_saved.name;
            req.cookies.userinfo = user_saved.name;
            //expire after 1 hour
            var hour = 3600000;
            req.session.cookie.expires = new Date(Date.now() + hour);
            req.session.cookie.maxAge = hour;
            req.session.save(function (err) {
                if (err) {
                    console.log(err);
                }
            });
            res.end("success");
        }
    });
}
exports.signup = signup;
