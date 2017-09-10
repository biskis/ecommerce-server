var config = require('config');
var mongoose = require('mongoose');
var Promise = require("bluebird");

// initiate db connection
mongoose.set('debug', false);
mongoose.Promise = Promise;

global.db = mongoose.createConnection(config.get('dbConfig.connectionString'), {
    db: { readPreference: 'primary' }
});


module.exports.UserService				= require("./user_service");
module.exports.ProductService		    = require("./product_service");
module.exports.OrderService		        = require("./order_service");
