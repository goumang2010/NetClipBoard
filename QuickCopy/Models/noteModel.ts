import mongoose = require('mongoose');
import noteSchema = require('../Schemas/note');
var NoteSchema= <mongoose.Schema>noteSchema
var Note = mongoose.model('note', NoteSchema);
module.exports = Note;

