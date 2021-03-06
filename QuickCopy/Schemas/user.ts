﻿import mongoose = require('mongoose');
import bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;


var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type:String
    },
    password: {
        unique: true,
        type: String
    },
    email: {
        unique: true,
        type: String
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();

    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            user.password = hash;
            next();
        });
    });

   
   
});
UserSchema.static("fetch", function (cb) {
    return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
});

UserSchema.static("findById", function (id, cb) {
     return (this.findOne({ _id: id }).exec(cb));
 });



module.exports = UserSchema;