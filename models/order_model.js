var orderSchema = require("./schemas/order_schema");

orderSchema.statics.statusEnum = {
    'in_cart':              'in_cart',
    'new':                  'new',
    'preparing':            'preparing',
    'packed':               'packed',
    'delivered':            'delivered',
    'complete':             'complete',
    'canceled':             'canceled'
};

var OrderModel = db.model('Order', orderSchema);
module.exports = OrderModel;