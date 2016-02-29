var mongoose = require('mongoose');
var noteSchema = require('../Schemas/note');
var NoteSchema = noteSchema;
var Note = mongoose.model('note', NoteSchema);
module.exports = Note;
