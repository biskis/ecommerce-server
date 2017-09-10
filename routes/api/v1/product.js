var Services = require('../../../services');
var ProductService = Services.ProductService;


module.exports.getAll = function(req, res, next) {
    ProductService.getAll().then(function(products) {
        res.render(products);
    }, function(err) {
        next(err);
    });
};

module.exports.getById = function(req, res, next) {
    var id = req.params.id;
    ProductService.getById(id).then(function(products) {
        res.render(products);
    }, function(err) {
        next(err);
    });
};

module.exports.add = function(req, res, next) {
    ProductService.add(req.body).then(function(product) {
        res.render(product);
    }, function(err) {
        next(err);
    });
};

module.exports.updateById = function(req, res, next) {
    var id = req.params.id;

    ProductService.updateById(id, req.body).then(function(product) {
        res.render(product);
    }, function(err) {
        next(err);
    });
};
module.exports.deleteById = function(req, res, next) {
    var id = req.params.id;

    ProductService.deleteById(id).then(function(products) {
        res.render(products);
    }, function(err) {
        next(err);
    });
};
