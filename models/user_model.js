var userSchema = require("./schemas/user_schema");

userSchema.statics.statusEnum = {
    'active':       'active',
    'suspended':    'suspended'
};

userSchema.statics.typeEnum = {
    'user':      'user',
    'manager':   'manager',
    'admin':     'admin'
};


var UserModel = db.model('User', userSchema);
module.exports = UserModel;