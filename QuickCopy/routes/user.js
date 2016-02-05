var userraw = require('../Models/userModel');
var User = userraw;
function signup(req, res) {
    var _user = req.body.user;
    var user = new User(_user);
    user.save(function (err, user) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(user);
        }
    });
}
exports.signup = signup;
//# sourceMappingURL=user.js.map