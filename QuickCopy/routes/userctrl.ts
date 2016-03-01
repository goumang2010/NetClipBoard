/// <reference path="../Scripts/typings/tsd.d.ts" />
import async = require('async');
import express = require('express');
import mongoose = require('mongoose');
import userraw = require('../Models/userModel');
import method = require('./sharedmethod');
var User = <mongoose.Model<mongoose.Document>>userraw;
export function signup(req: express.Request, res: express.Response) {
    var _user = req.body;
    var user = new User({ name: _user.name, password: _user.password, email: _user.email});
    //OK --100
    //name dupilicated --101
    //email duplicated --102

    async.waterfall(
        [
        function(cb){
          console.log("check name");
          User.findOne({ "name": _user.name }, function(err, bsonres) {
        if (err || (bsonres != null)) {
            
            res.end("101");
            return;
        }
        else {
            cb()
        }
    });
        },
        function(cb){
         console.log("check email");
         User.findOne({ "email": _user.email }, function(err, bsonres) {
        if (err || (bsonres != null)) {
            console.log(err);
            res.end("102");
            return;
        }
        else {
            cb()
        }
        });
     },
     function(cb){
         
        user.save(function (err, user_saved:any) {
        if (err) {
            console.log(err);
           // res.end(err);
        }
        else {
            console.log(user_saved);
            //write cookie and session
            req.cookies.userinfocok = user_saved.name;
            new method.sess(req).setitem("userinfosess",user_saved.name)
            //expire after 1 hour
            var hour = 3600000;
            req.session.cookie.expires = new Date(Date.now() + hour);
            req.session.cookie.maxAge = hour;
            req.session.save(function(err) {
              if (err) {
                console.log(err);
              }
            });
            console.log("save data");
            res.end("100"); 
            return;   
        }
    });
     }],
     function (err) {
          if (err) console.error(err.message);
           res.end("ccc");
        });


    


}