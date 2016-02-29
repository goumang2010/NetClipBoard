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
            res.end("success");
        }
    });
}
exports.signup = signup;
