import express = require('express');
import mongoose = require('mongoose');
import userraw = require('../Models/userModel');
var User = <mongoose.Model<mongoose.Document>>userraw;
export function signup(req: express.Request, res: express.Response) {
    var _user = req.body;
    var user = new User({ name: _user.name, password: _user.password, email: _user.email});
   // console.log(user);
    user.save(function (err, user_saved) {
        if (err) {
            console.log(err);
           // res.end(err);
        }
        else {
            console.log(user_saved);
          res.end("success");
           
        }

    });
}