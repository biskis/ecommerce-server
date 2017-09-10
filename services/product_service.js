var Promise = require('bluebird');
var config = require("config");
var moment = require('moment-timezone');

var ProductModel = require('../models/product_model');

var EcommerceErrors = require('../errors');

var ProductService = {

    getAll: function (userId) {
        return ProductModel.find({}).sort({"name": 1, "_id": 1}).then(function(products) {
            return products;
        })
    },
    getById: function(id) {
        return ProductModel.findById(id);
    },
    add: function (body) {
        if(!body.title || !body.description || !body.price || parseFloat(body.price) < 0 || !body.quantity || parseInt(body.quantity) < 0) {
            throw new EcommerceApiError.ProductFieldsMissing();
        }

        return ProductModel.create({
            title: body.title,
            description: body.description,
            price: parseFloat(body.price),
            quantity: parseInt(body.quantity),
        });
    },
    updateById: function (id, body) {
        if(!body.title || !body.description || !body.price || parseFloat(body.price) < 0 || !body.quantity || parseInt(body.quantity) < 0) {
            throw new EcommerceApiError.ProductFieldsMissing();
        }

        return ProductModel.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    title: body.title,
                    description: body.description,
                    price: parseFloat(body.price),
                    quantity: parseInt(body.quantity),
                }
            },
            {new: false, upsert: false}
        );
    },
    deleteById: function (id) {
        return ProductModel.remove({_id: id}).then(function(){
            return ProductService.getAll();
        })
    }

};

module.exports = ProductService;