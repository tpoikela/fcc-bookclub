'use strict';

const mongoose = require('mongoose');
const Validation = require('../common/validation.js');

var validator = new Validation();

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new Schema({

    // Used to access the information in database
    username: {
        required: true,
        type: String,
        validate: {
            validator: validator.validateName,
            message: 'Name cannot contain < or >'
        }
    },

    // Used for local user and password auth
    local: {
        required: true,
        type: Object,
        username: {
            required: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
        validate: {
            validator: function(v) {
                return v.hasOwnProperty('username')
                    && v.hasOwnProperty('password');
            },
            message: 'username and password must exist.'
        }

    },

    // Complementary (optional) user info
    userAddress: {type: String},
    userEmail: {type: String},
    userFullname: {type: String},
    userPostCode: {type: String},
    userState: {type: String},

    bookList: [{type: ObjectId, ref: 'Book'}],
    tradeReqs: {type: Array}

},
{collection: 'users'}
);

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

/* Returns the full document for given username. Doesn't populate. */
UserSchema.statics.getUser = function(username, cb) {
    var User = this.model('User');
    if (username) {
        User.findOne({username: username}, (err, data) => {
            if (err) {cb(err);}
            else if (data) {cb(null, data);}
            else {
                var error = new Error('No user |' + username + '| found.');
                cb(error);
            }
        });
    }
    else {
        var error = new Error('No username given.');
        cb(error);
    }
};

/* Calls given callback with user ID corresponding to the given username.*/
UserSchema.statics.getUserID = function(username, cb) {
    var User = this.model('User');
    User.findOne({username: username}, (err, data) => {
        if (err) {return cb(err);}
        if (data) {return cb(null, data._id);}

        var error = new Error('No user with given ID found.');
        return cb(error);
    });
};

/* Adds one trade request for this user. */
UserSchema.statics.addTradeReq = function(username, tradeReq, cb) {
    var User = this.model('User');
    tradeReq.createdOn = new Date().toDateString();
    tradeReq.state = 'Pending';
    var pushObj = {$push: {tradeReqs: tradeReq}};
    User.update({username: username}, pushObj, (err, data) => {
        if (err) {cb(err);}
        else {
            cb(null, data);
        }
    });
};

/* Removes one trade request from a user.*/
UserSchema.statics.removeTradeReq = function(username, tradeReq, cb) {
    var User = this.model('User');

    var pullObj = {
        $pull: {tradeReqs: {
            'book.title': tradeReq.book.title
            // createdOn: tradeReq.createdOn
        }}
    };

    User.update({username: username}, pullObj, (err, data) => {
        if (err) {cb(err);}
        else {
            if (data.nModified === 0) {
                console.warn('User.removeTradeReq no modifications done.');
            }
            console.log('removeTradeReq data: ' + JSON.stringify(data));
            cb(null, data);
        }
    });
};

/* Sets the state of given tradeReq as accepted. tradeReq is identified by
 * createdOn date.*/
UserSchema.statics.acceptTradeReq = function(username, tradeReq, cb) {
    var User = this.model('User');

    var queryObj = {
        username: username,
        'tradeReqs.createdOn': tradeReq.createdOn
    };
    console.log('acceptTradeReq looking for date ' + tradeReq.createdOn +
        ' and user ' + username);

    var setObj = {
        $set: {
            'tradeReqs.$.state': 'Accepted',
            'tradeReqs.$.acceptedWith': tradeReq.acceptedWith,
            'tradeReqs.$.acceptedOn': new Date().toDateString()
        }
    };

    User.update(queryObj, setObj, (err, data) => {
        if (err) {cb(err);}
        else {
            if (data.nModified === 0) {
                console.warn('User.acceptTradeReq no modifications done.');
            }
            cb(null, data);
        }
    });
};

/* Sets the state of given tradeReq as rejected. tradeReq is identified by
 * createdOn date.*/
UserSchema.statics.rejectTradeReq = function(username, tradeReq, cb) {
    var User = this.model('User');

    var queryObj = {
        username: username,
        'tradeReqs.createdOn': tradeReq.createdOn
    };

    var setObj = {
        $set: {
            'tradeReqs.$.state': 'Rejected',
            'tradeReqs.$.rejectedOn': new Date().toDateString()
        }
    };

    User.update(queryObj, setObj, (err, data) => {
        if (err) {cb(err);}
        else {
            if (data.nModified === 0) {
                console.warn('User.rejectTradeReq no modifications done.');
            }
            cb(null, data);
        }
    });

};

/* Returns all books for the given user. Does a populate. */
UserSchema.statics.getBooksForUser = function(username, cb) {
    var User = this.model('User');
    var queryObj = {username: username};
    var filter = {username: 1, bookList: 1, _id: 0};
    User.findOne(queryObj, filter)
        .populate('bookList')
        .exec( (err, user) => {
            if (err) {cb(err);}
            else {cb(null, user);}
        });
};

//---------------------------------------------------------------------------
// INSTANCE METHODS
//---------------------------------------------------------------------------

/* Updates the user info with given object. Note that obj must match the user
 * schema.*/
UserSchema.methods.update = function(obj, cb) {
    var setVals = {$set: obj};
    this.model('User').update({_id: this._id}, setVals, {}, (err, data) => {
        if (err) {cb(err, null);}
        cb(null, data);
    });
};

/* Adds one book for the user.*/
UserSchema.methods.addBook = function(bookId, cb) {
    var list = this.bookList;
    list.push(bookId);
    var updateObj = {bookList: list};
    this.update(updateObj, cb);
};

/* Removes a book from user. */
UserSchema.methods.removeBook = function(bookId, cb) {
    var list = this.bookList;
    var index = list.indexOf(bookId);
    if (index >= 0) {
        list.splice(index, 1);
        var updateObj = {bookList: list};
        this.update(updateObj, cb);
    }
    else {
        console.error('No book ID' + bookId.toString() + ' found for user '
            + this.username);
        console.error('User bookList: ' + JSON.stringify(list));
    }
};

module.exports = mongoose.model('User', UserSchema);
