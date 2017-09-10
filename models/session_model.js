var mongoose  = require('mongoose');

var sessionSchema = require("./schemas/session_schema");

sessionSchema.statics.createSessionForUser = function(userId) {
    return SessionModel.findOneAndUpdate(
        {'user': userId},
        {$set: {'user': userId, 'ts': new Date()}},
        {new: true, upsert: true}
    ).exec();
};

var SessionModel = db.model('Session', sessionSchema);
module.exports = SessionModel;