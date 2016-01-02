var mongoose = require('mongoose');
var noteSchema = require('../Schemas/note');
var NoteSchema = noteSchema;
var Note = mongoose.model('Note', NoteSchema);
module.exports = Note;
//# sourceMappingURL=noteModel.js.map