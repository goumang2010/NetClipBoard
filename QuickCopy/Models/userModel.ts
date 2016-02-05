import mongoose = require('mongoose');
import userSchema = require('../Schemas/user');
var UserSchema = <mongoose.Schema>userSchema
var User = mongoose.model('user', UserSchema);
module.exports = User;