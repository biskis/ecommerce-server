var Promise = require('bluebird');
var config = require("config");
var moment = require('moment-timezone');
var bcrypt = require('bcrypt');
// var crypto = require("crypto");
var validator = require('validator');

var UserModel = require('../models/user_model');
var SessionModel = require('../models/session_model');

reCAPTCHA=require('recaptcha2');


var EcommerceErrors = require('../errors');


var UserService = {

    loginWithEmail: function (email, password) {
        var locals = {};

        if (!email) throw EcommerceErrors.EmailIsRequired();
        if (!password) throw EcommerceErrors.PasswordIsRequired();

        return UserModel.findOne({'email': email}).then(function(user) {
            if ( !user ) throw EcommerceErrors.IncorrectEmailOrPassword();

            locals.user = user;

            console.log(password, user.password, user);

            return Promise.promisify(bcrypt.compare)(password, user.password);
        }).then(function(match) {
            if ( !match ) throw EcommerceErrors.IncorrectEmailOrPassword();

            return SessionModel.createSessionForUser(locals.user._id);
        }).then(function(session) {
            delete locals.user.password;
            return Promise.resolve({user: locals.user, auth_key: session._id});
        });
    },

    _validateUser: function(body) {
        return Promise.resolve().then(function() {
            if (!body.first_name || !body.first_name) throw EcommerceErrors.FirstNameIsRequired();
            if (!body.last_name || !body.last_name) throw EcommerceErrors.LastNameIsRequired();
            if (!body.email) throw EcommerceErrors.EmailIsRequired();
            if (!validator.isEmail(body.email)) throw EcommerceErrors.InvalidEmailAddress();
            if (!body.password) throw EcommerceErrors.PasswordIsRequired();
            if (body.password.length<6) throw EcommerceErrors.InvalidPassword();

            return UserModel.findOne({email: body.email});
        }).then(function(emailAlreadyExists) {
            if (emailAlreadyExists) throw EcommerceErrors.EmailAlreadyExists();

            return body;
        });
    },

    /**
     * Signup with email
     * @param body
     */
    register: function (body) {
        var locals = {};

        recaptcha=new reCAPTCHA({
            siteKey: config.get('recaptcha.site_key'),
            secretKey:config.get('recaptcha.secret_key')
        });

        return recaptcha.validate(body.recaptcha).then(function() {
            //All good with recaptcah.
            return UserService._validateUser(body);
        }).then(function(validatedBody) {
            body = validatedBody;

            return Promise.promisify(bcrypt.genSalt)(config.get('SALT_WORK_FACTOR'));
        }).then(function(salt) {
            locals.pwdSalt = salt;

            return Promise.promisify(bcrypt.hash)(body.password, salt);
        }).then(function(hash) {

            return UserModel.create({
                email: body.email,
                password: hash,

                first_name: body.first_name,
                last_name: body.last_name,

                type: UserModel.typeEnum.user,
                status: UserModel.statusEnum.active,

                createdTs: new Date(),
                updatedTs: new Date()
            });
        }).then(function(user) {
            locals.user = user;

            return SessionModel.createSessionForUser(user._id);
        }).then(function(session) {
            delete locals.user.password;

            // Notifications.email.sendUserWelcome(locals.user);

            return Promise.resolve({user: locals.user, auth_key: session._id});
        });
    },

    findUserById: function (userId) {
        return UserModel.findById(userId).exec();
    },

    updateUserById: function (userId, body) {
        var updateArray = {'updatedTs': new Date()};

        if(body.first_name) updateArray['first_name'] = body.first_name;
        if(body.last_name) updateArray['last_name'] = body.last_name;
        if(body.address_street) updateArray['address_street'] = body.address_street;
        if(body.address_city) updateArray['address_city'] = body.address_city;
        if(body.address_state) updateArray['address_state'] = body.address_state;
        if(body.address_postcode) updateArray['address_postcode'] = body.address_postcode;
        if(body.billing_address_street) updateArray['billing_address_street'] = body.billing_address_street;
        if(body.billing_address_city) updateArray['billing_address_city'] = body.billing_address_city;
        if(body.billing_address_state) updateArray['billing_address_state'] = body.billing_address_state;
        if(body.billing_address_postcode) updateArray['billing_address_postcode'] = body.billing_address_postcode;
        if(body.type) updateArray['type'] = body.type;

        return UserModel.findById(userId).then(function(user) {
            if(body.email && body.email != user.email) updateArray['email'] = body.email;

            return UserModel.findOneAndUpdate(
                {_id: userId},
                {
                    $set: updateArray
                },
                {"new": true, upsert: false}
            );
        }).then(function (user) {

            return user;
        });
    },

    findUserBySessionId: function (sessionId) {
        return SessionModel.findById(sessionId).exec().then(function (session) {
            if (!session) throw EcommerceErrors.MissingSession();

            return UserModel.findById(session.user).exec();
        });
    },

    logoutUser: function (sessionId) {
        var locals = {};
        return UserService.findUserBySessionId(sessionId).then(function (user) {
            if (!user) return "User is already logout";
            locals.user = user;

            return SessionModel.remove({'_id': sessionId}).exec();
        }).then(function () {
            // reset notification tokens
            return UserModel.update(
                {_id: locals.user._id},
                {
                    $unset: {
                        apnToken: 1, apnIsDev: 1, gcmToken: 1
                    }
                },
                {upsert: false, multi: false}
            ).exec();
        }).then(function () {
            return true;
        });
    },

    getAll: function () {
        return UserModel.find();
    },
    add: function (body) {
        var locals = {};
        return UserService._validateUser(body).then(function(validatedBody) {
            body = validatedBody;

            return Promise.promisify(bcrypt.genSalt)(config.get('SALT_WORK_FACTOR'));
        }).then(function(salt) {
            locals.pwdSalt = salt;

            return Promise.promisify(bcrypt.hash)(body.password, salt);
        }).then(function(hash) {

            return UserModel.create({
                email: body.email,
                password: hash,

                first_name: body.first_name,
                last_name: body.last_name,

                type: body.type,
                status: UserModel.statusEnum.active,

                address_street: body.address_street,
                address_city: body.address_city,
                address_state: body.address_state,
                address_postcode: body.address_postcode,
                billing_address_street: body.billing_address_street,
                billing_address_city: body.billing_address_city,
                billing_address_state: body.billing_address_state,
                billing_address_postcode: body.billing_address_postcode,

                createdTs: new Date(),
                updatedTs: new Date()
            });
        }).then(function(user) {
            return user;
        });
    },
    deleteById: function (id) {
        return UserModel.remove({_id: id}).then(function(){
            return UserService.getAll();
        })
    },
};

module.exports = UserService;