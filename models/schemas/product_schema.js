var mongoose  = require('mongoose');

var productSchema = new mongoose.Schema({
    title                           : {type: String},
    description                     : {type: String},
    picture                         : {type: String},
    price                           : {type: Number},
    quantity                        : {type: Number},

    // timestamps
    createdTs                   : {type: Date},
    updatedTs                   : {type: Date}
}, {strict: true, id: false});

// define the index
productSchema.index({ 'title' : 1 });

module.exports = productSchema;