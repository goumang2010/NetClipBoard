var mongoose = require('mongoose');
var userSchema = require('../Schemas/user');
var UserSchema = userSchema;
var User = mongoose.model('user', UserSchema);
module.exports = User;
