import express = require('express');
import mongoose = require('mongoose');
import userraw = require('../Models/userModel');
var User = <mongoose.Model<mongoose.Document>>userraw;
export function signup(req: express.Request, res: express.Response) {
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