var Services = require('../../../services');
var UserService = Services.UserService;
var UserModel = require('../../../models/user_model');

var apiRoutes = {
    user		: require('./user'),
    product		: require('./product'),
    order		: require('./order'),

    authHandler: function(types) {
        types = types || [];
        return 	function(req, res, next) {
            req.auth_key = req.header('auth_key');
            UserService.findUserBySessionId(req.auth_key).then(function(user) {
                if (!user) return next( new Error('No user for given auth_key') );
                if (types.indexOf(user.type) === -1) return next( new Error('No user for given auth_key') );

                req.authUser = user;
                console.log('Auth user: ', user._id, 'type: ', user.type, "type: ", types);
                next();
            }, function(err) {
                next(err);
            });
        };
    },
    successHandler: function(req, res, next) {
        res.render = function(data) {
            res.status(200).json({success: 1, data: data});
        };

        next();
    },
    errorHandler: function(err, req, res, next) {
        var code = 500;
        var msg = "An unknown error occurred processing your request. Please try again later.";
        if ( err ) {
            msg = err.message || msg;

            console.log(err);
            console.log(err.stack);
        }

        if (err.isEcommerceApiError) {
            code = err.code;
        }

        res.status(400).json({error: {code: code, msg: msg}});
    }
};


module.exports = function() {
    var express = require('express');
    var app = express();

    app.set('etag', false); // same

    app.use(apiRoutes.successHandler);


    app.get('/', function(req, res) {res.send('E-commerce API V1')});

    // user api
    app.post('/user/login',
        apiRoutes.user.loginWithEmail);
    app.post('/user/register',
        apiRoutes.user.register);
    app.get('/user', 								apiRoutes.authHandler([UserModel.typeEnum.user, UserModel.typeEnum.manager, UserModel.typeEnum.admin]),
        apiRoutes.user.findUser);
    app.post('/user/update', 						apiRoutes.authHandler([UserModel.typeEnum.user, UserModel.typeEnum.manager, UserModel.typeEnum.admin]),
        apiRoutes.user.updateUser);
    app.get('/user/logout', 						apiRoutes.authHandler([UserModel.typeEnum.user, UserModel.typeEnum.manager, UserModel.typeEnum.admin]),
        apiRoutes.user.logoutUser);


    app.get('/users/all',                           apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.user.getAll);
    app.get('/user/get/:id',                        apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.user.getById);
    app.post('/user/add',                           apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.user.add);
    app.post('/user/update/:id',                    apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.user.updateById);
    app.delete('/user/delete/:id',                  apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.user.deleteById);




    app.get('/products',
        apiRoutes.product.getAll);
    app.get('/product/get/:id',
        apiRoutes.product.getById);
    app.post('/product/add',                        apiRoutes.authHandler([UserModel.typeEnum.admin, UserModel.typeEnum.manager]),
        apiRoutes.product.add);
    app.post('/product/update/:id',                 apiRoutes.authHandler([UserModel.typeEnum.admin, UserModel.typeEnum.manager]),
        apiRoutes.product.updateById);
    app.delete('/product/delete/:id',               apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.product.deleteById);




    app.post('/order/create', 				        apiRoutes.authHandler([UserModel.typeEnum.user]),
        apiRoutes.order.create);
    app.get('/order/mine', 				        apiRoutes.authHandler([UserModel.typeEnum.user]),
        apiRoutes.order.findMine);

    app.get('/orders/all', 				        apiRoutes.authHandler([UserModel.typeEnum.admin, UserModel.typeEnum.manager]),
        apiRoutes.order.findAll);
    app.post('/order/set_status/:id', 	        apiRoutes.authHandler([UserModel.typeEnum.manager]),
        apiRoutes.order.setStatus);
    app.delete('/order/delete/:id', 	        apiRoutes.authHandler([UserModel.typeEnum.admin]),
        apiRoutes.order.deleteById);


    app.use(apiRoutes.errorHandler);

    return app;
}();