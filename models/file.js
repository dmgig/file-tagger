// The File model

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FileSchema   = new Schema({
    filepath: String,
    file_md5: String,
    filetags: Array,
    added:    { type: Date, default: Date.now },
    updated:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);