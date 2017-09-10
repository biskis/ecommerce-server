var mongoose  = require('mongoose');

var sessionSchema = new mongoose.Schema({
    user                      : {type: mongoose.Schema.ObjectId},
    createdTs                 : {type: Date},
    updatedTs                 : {type: Date}
}, {strict: true, id: false});

// define indexes
sessionSchema.index({ "user": 1 });


module.exports = sessionSchema;