/// <reference path="../Scripts/typings/tsd.d.ts" />
import bcrypt = require('bcrypt');
import async = require('async');
import express = require('express');
import mongoose = require('mongoose');
import userraw = require('../Models/userModel');
import method = require('./sharedmethod');
var User = <mongoose.Model<mongoose.Document>>userraw;
export function signup(req: express.Request, res: express.Response) {
    var _user = req.body;
    var user = new User({ name: _user.name, password: _user.password, email: _user.email });
    //OK --100
    //name dupilicated --101
    //email duplicated --102

    async.waterfall(
        [
      function(cb) {
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
      function(cb) {
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
      function(cb) {

        user.save(function(err, user_saved: any) {
          if (err) {
            console.log(err);
            // res.end(err);
          }
          else {
            console.log(user_saved);
            setcs(req,res,user_saved.name);
            res.end("100");
            return;
          }
        });
      }],
    function(err) {
      if (err) console.error(err.message);
      res.end("ccc");
        });
}
  export function signin(req: express.Request, res: express.Response) {
    console.log("signin start");
    var _user = req.body;
    var user = new User({ name: _user.name, password: _user.password, email: _user.email });
    //OK --200
    //name not found --201
    //password not found --202
    //other errors --203

    console.log("check name");
    User.findOne({ "name": _user.name }, function(err, bsonres) {
      //if any err or name not found,then return 201
      if (err || (bsonres == null)) {
        res.end("201");
        return;
      }
      else {
        var encryptedkey = bsonres.get("password");
        bcrypt.compare(_user.password, encryptedkey, function(err, same) {
          if (err) {
            res.end("203");
            return;
          }
          else {
            if (same) {
              //set cookie and session
              setcs(req,res,_user.name);
              res.end("200");
              return;
            }
            else {
              res.end("202");
              return;
            }
          }
        });
      }
    });
  }

  function setcs(req: express.Request, res: express.Response,username: string) {
    //write cookie and session
    //expire after 1 hour
    var hour = 3600000;
    var opt = {
      expires: new Date(Date.now() + hour).toUTCString(),
      maxAge: hour
    };
    res.setHeader('Set-Cookie', method.serialize('usrinfo', username, opt));
    new method.sess(req).setitem("userinfosess", username)
    req.session.save(function(err) {
      if (err) {
        console.log(err);
      }
    });

  }




