var mongoose  = require('mongoose');

var userSchema = new mongoose.Schema({
    email                       : {type: String},
    password                    : {type: String},

    first_name               : {type: String},
    last_name                : {type: String},
    address_street          : {type: String},
    address_city            : {type: String},
    address_state           : {type: String},
    address_postcode        : {type: String},
    billing_address_street          : {type: String},
    billing_address_city            : {type: String},
    billing_address_state           : {type: String},
    billing_address_postcode        : {type: String},

    status                      : {type: String},
    type                        : {type: String},

    // timestamps
    createdTs                   : {type: Date},
    updatedTs                   : {type: Date}
}, {strict: true, id: false});

// define the index
userSchema.index({ 'email' : 1 }, { unique: true, sparse: true });

module.exports = userSchema;