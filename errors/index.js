var util = require('util');
function EcommerceApiError(code, message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.message = message;
    this.code = code;

    this.name = 'EcommerceApiError';
    this.isEcommerceApiError = true;
}

EcommerceApiError.prototype.__proto__ = Error.prototype;

module.exports = {
    Unknown: function () {
        return new EcommerceApiError(0, 'An unknown error occurred processing your request. Please try again later.');
    },
    EmailIsRequired: function () {
        return new EcommerceApiError(2, 'Email is required.');
    },
    InvalidEmailAddress: function () {
        return new EcommerceApiError(3, 'Invalid email address.');
    },
    IncorrectEmail: function () {
        return new EcommerceApiError(4, 'Email is incorrect.');
    },
    EmailAlreadyExists: function () {
        return new EcommerceApiError(5, 'Email address already exists.');
    },
    UserNotExists: function (email) {
        return new EcommerceApiError(6, util.format('User not exists for %s email address.', email));
    },
    IncorrectEmailOrPassword: function () {
        return new EcommerceApiError(7, 'Incorrect email or password.');
    },
    PasswordIsRequired: function () {
        return new EcommerceApiError(8, 'Password is required.');
    },
    IncorrectPassword: function () {
        return new EcommerceApiError(9, 'Password is incorrect.');
    },
    InvalidPassword: function () {
        return new EcommerceApiError(10, 'Password must be 6 characters long.');
    },
    MissingSession: function () {
        return new EcommerceApiError(11, 'Session is missing.');
    },
    TokenIsRequired: function () {
        return new EcommerceApiError(12, 'Token is required.');
    },
    InvalidActivationToken: function () {
        return new EcommerceApiError(13, 'Invalid activation token.');
    },
    FirstNameIsRequired: function () {
        return new EcommerceApiError(14, 'First name is required.');
    },
    LastNameIsRequired: function () {
        return new EcommerceApiError(15, 'Last name is required.');
    },
    InvalidUserType: function () {
        return new EcommerceApiError(16, 'Type is invalid.');
    },
    InvalidParameter: function (message) {
        return new EcommerceApiError(20, util.format('Invalid parameter: ', message));
    },

    ProductsAreRequired: function () {
        return new EcommerceApiError(30, 'Products are required.');
    },

    MissingStripeCustomerId: function () {
        return new EcommerceApiError(40, 'Customer ID is missing.');
    },
    MissingAddressFields: function () {
        return new EcommerceApiError(45, 'Address fields are missing.');
    },
    UserPinInvalid: function () {
        return new EcommerceApiError(46, 'PIN is invalid.');
    },
    OrderNoProducts: function () {
        return new EcommerceApiError(47, 'There are no products in current order.');
    },
    OrderNoDeliveryOption: function () {
        return new EcommerceApiError(48, 'Delivery option is mandatory.');
    },
    OrderNoDeliveryMethod: function () {
        return new EcommerceApiError(49, 'Delivery method is mandatory.');
    },
    OrderNoCard: function () {
        return new EcommerceApiError(50, 'Card is mandatory.');
    },
    OrderNoAddress: function () {
        return new EcommerceApiError(51, 'Address is mandatory.');
    },
    OrderNoPrice: function () {
        return new EcommerceApiError(52, 'There is no price for this order.');
    },
    CurrentOrderNotFound: function () {
        return new EcommerceApiError(53, 'Current order not found');
    },
    OrderNotFound: function () {
        return new EcommerceApiError(54, 'Order not found.');
    },
    InvalidStatusForOrder: function () {
        return new EcommerceApiError(59, 'Invalid status for order.');
    },
    ProductFieldsMissing: function () {
        return new EcommerceApiError(60, 'Product fileds missing.');
    },

};
