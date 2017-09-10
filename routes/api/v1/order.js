var Services = require('../../../services');
var OrderService = Services.OrderService;

module.exports.create = function(req, res, next) {
    var userId = req.authUser._id;
    var cartItems = req.body.cart;
    var stripeToken = req.body.stripe_token;

    OrderService.create(userId, cartItems, stripeToken).then(function(order) {
        res.render(order);
    }, function(err) {
        next(err);
    });
};

module.exports.findMine = function(req, res, next) {
    var userId = req.authUser._id;

    OrderService.findMine(userId).then(function(orders) {
        res.render(orders);
    }, function(err) {
        next(err);
    });
};

module.exports.findAll= function(req, res, next) {
    OrderService.findAll().then(function(orders) {
        res.render(orders);
    }, function(err) {
        next(err);
    });
};
module.exports.setStatus= function(req, res, next) {
    var id = req.params.id;
    var status = req.body.status;

    OrderService.setStatus(id, status).then(function(orders) {
        res.render(orders);
    }, function(err) {
        next(err);
    });
};
module.exports.deleteById= function(req, res, next) {
    var id = req.params.id;

    OrderService.deleteById(id).then(function(orders) {
        res.render(orders);
    }, function(err) {
        next(err);
    });
};