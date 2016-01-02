var mongoose = require('mongoose');
var NoteSchema = new mongoose.Schema({
    userID: String,
    fetchKey: String,
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
NoteSchema.pre('save', function () {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
});
NoteSchema.static("fetch", function (cb) {
    return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb);
});
NoteSchema.static("findById", function (id, cb) {
    return this
        .findOne({ _id: id })
        .exec(cb);
});
module.exports = NoteSchema;
//# sourceMappingURL=note.js.map