"use strict";
/// <reference path="../Scripts/typings/tsd.d.ts" />
var async = require('async');
var userraw = require('../Models/userModel');
var method = require('./sharedmethod');
var User = userraw;
function signup(req, res) {
    var _user = req.body;
    var user = new User({ name: _user.name, password: _user.password, email: _user.email });
    //OK --100
    //name dupilicated --101
    //email duplicated --102
    async.waterfall([
        function (cb) {
            console.log("check name");
            User.findOne({ "name": _user.name }, function (err, bsonres) {
                if (err || (bsonres != null)) {
                    res.end("101");
                    return;
                }
                else {
                    cb();
                }
            });
        },
        function (cb) {
            console.log("check email");
            User.findOne({ "email": _user.email }, function (err, bsonres) {
                if (err || (bsonres != null)) {
                    console.log(err);
                    res.end("102");
                    return;
                }
                else {
                    cb();
                }
            });
        },
        function (cb) {
            user.save(function (err, user_saved) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(user_saved);
                    //write cookie and session
                    //expire after 1 hour
                    var hour = 3600000;
                    var opt = {
                        expires: new Date(Date.now() + hour).toUTCString(),
                        maxAge: hour
                    };
                    console.log(opt);
                    res.setHeader('Set-Cookie', method.serialize('usrinfo', user_saved.name, opt));
                    new method.sess(req).setitem("userinfosess", user_saved.name);
                    req.session.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log("save data");
                    res.end("100");
                    return;
                }
            });
        }], function (err) {
        if (err)
            console.error(err.message);
        res.end("ccc");
    });
}
exports.signup = signup;
