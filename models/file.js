// The File model

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FileSchema   = new Schema({
    path:     String,
    md5:      String,
    tags:     Array,
    added:    { type: Date, default: Date.now },
    updated:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);