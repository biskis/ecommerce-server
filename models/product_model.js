var productSchema = require("./schemas/product_schema");

var ProductModel = db.model('Product', productSchema);
module.exports = ProductModel;