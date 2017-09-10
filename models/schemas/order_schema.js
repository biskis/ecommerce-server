var mongoose  = require('mongoose');

var orderSchema = new mongoose.Schema({
    user                            : {type: mongoose.Schema.ObjectId},
    status                          : {type: String},
    address                         : {},
    billing_address                 : {},

    card_id                         : {type: String},
    stripe                          : {},

    products                        : [],

    prices  : {
        products                    : { type: Number},
        delivery                    : { type: Number},
        total                       : { type: Number}
    },

    // timestamps
    createdTs                   : {type: Date},
    updatedTs                   : {type: Date},
    orderTs                     : {type: Date}  //Time when user payed
}, {strict: true, id: false});

// define the index
orderSchema.index({ 'user_id' : 1 });
orderSchema.index({ 'status' : 1 });

module.exports = orderSchema;