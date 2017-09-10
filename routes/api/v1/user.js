var Services = require('../../../services');
var UserService = Services.UserService;
module.exports.loginWithEmail = function(req, res, next) {
    console.log(req.body);

    var email = req.body.email;
    var password = req.body.password;

    UserService.loginWithEmail(email, password).then(function(userAndToken) {
        res.render(userAndToken);
    }, function(err) {
        next(err);
    });
};

module.exports.register = function(req, res, next) {
    console.log(req.body);

    UserService.register(req.body).then(function(userAndToken) {
        res.render(userAndToken);
    }, function(err) {
        next(err);
    });
};

module.exports.findUser = function(req, res, next) {
    var userId = req.params.id || req.authUser._id;
    UserService.findUserById(userId).then(function(user) {
        res.render(user);
    }, function(err) {
        next(err);
    });
};

module.exports.updateUser = function(req, res, next) {
    var userId = req.body.id || req.authUser._id;

    UserService.updateUserById(userId, req.body).then(function(update) {
        res.render(update);
    }, function(err) {
        next(err);
    });
};

module.exports.logoutUser = function(req, res, next) {
    req.auth_key = req.header('auth_key');

    UserService.logoutUser(req.auth_key).then(function(response) {
        res.render(response);
    }, function(err) {
        next(err);
    });
};





module.exports.getAll= function(req, res, next) {

    UserService.getAll().then(function(users) {
        res.render(users);
    }, function(err) {
        next(err);
    });
};
module.exports.getById= function(req, res, next) {

    var id = req.params.id;

    UserService.findUserById(id).then(function(user) {
        res.render(user);
    }, function(err) {
        next(err);
    });
};
module.exports.add= function(req, res, next) {

    UserService.add(req.body).then(function(user) {
        res.render(user);
    }, function(err) {
        next(err);
    });
};
module.exports.updateById= function(req, res, next) {

    UserService.updateUserById(req.params.id, req.body).then(function(user) {
        res.render(user);
    }, function(err) {
        next(err);
    });
};
module.exports.deleteById= function(req, res, next) {

    UserService.deleteById(req.params.id).then(function(users) {
        res.render(users);
    }, function(err) {
        next(err);
    });
};