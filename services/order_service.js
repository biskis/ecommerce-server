var Promise = require('bluebird');
var config = require("config");
var moment = require('moment-timezone');
var _ = require('underscore');

var OrderModel = require('../models/order_model');
var UserModel = require('../models/user_model');
var ProductModel = require('../models/product_model');

var Stripe = require('stripe')(config.stripe.secret_key, 'latest');

var EcommerceErrors = require('../errors');


var OrderService = {

    create: function (userId, cart, stripe_token) {
        var locals = {};
        if (!cart || cart.length === 0) throw EcommerceErrors.ProductsAreRequired();
        if (!stripe_token) throw EcommerceErrors.OrderNoCard();

        return UserModel.findById(userId).then(function(user) {
            locals.user = user;

            var price = 0;
            cart.forEach(function(item) {
                price += item.quantity * item.data.price;
            });


            var new_order = {
                user: userId,
                products: cart,
                card_id: stripe_token,
                status: OrderModel.statusEnum.in_cart,
                address: {
                    street: user.address_street,
                    city: user.address_city,
                    state: user.address_state,
                    postcode: user.address_postcode,
                },
                billing_address: {
                    street: user.billing_address_street,
                    city: user.billing_address_city,
                    state: user.billing_address_state,
                    postcode: user.billing_address_postcode,
                },
                prices: {
                    products: price,
                    delivery: 0,
                    total: price
                },
                'updatedTs': new Date(),
                'createdTs': new Date(),
            };

            return OrderModel.create(new_order);
        }).then(function(order) {
            locals.order = order;
            if (!order) throw new EcommerceApiError.OrderNoProducts();

            //make the payment
            var payment_data = {
                currency: config.get('currency'),
                amount: Math.round(order.prices.total * 100),   //in cents
                source: stripe_token,
                description: 'Ecommerce order',
                statement_descriptor: 'Ecommerce order',
                capture: true
            };
            console.log("payment data", payment_data);
            return Stripe.charges.create(payment_data);
        }).then(function (charge) {
            locals.charge = charge;

            return OrderModel.findOneAndUpdate(
                {
                    _id: locals.order._id
                },
                {
                    $set: {
                        status: OrderModel.statusEnum.new,
                        stripe: {
                            authorizationCharge: locals.charge.id
                        },
                        updateTs: new Date()
                    }
                },
                {"new": true, upsert: false}
            );
        }).then(function (order) {
            return order;
        });
    },



    findMine: function (userId) {
        return OrderModel.find(
            {
                user: userId
            }
        ).then(function (orders) {
            return orders;
        });
    },


    findAll: function () {
        return OrderModel.find({});
    },

    setStatus: function (id, status) {
        return OrderModel.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    status: status
                }
            },
            {new: false, upsert: false}
        ).then(function (order) {
            return order;
        });
    },

    deleteById: function (id) {
        return OrderModel.remove(
            {
                _id: id
            }
        ).then(function () {
            return OrderService.findAll();
        });
    }


};

module.exports = OrderService;