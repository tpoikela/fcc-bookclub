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

    email: {
        type: String
    },

    fullName: {
        type: String
    },

    address: {
        type: String
    },

    state: {
        type: String
    },

    bookList: [{type: ObjectId, ref: 'Book'}],
    tradeReqsPending: [{type: ObjectId, ref: 'TradeReq'}]

},
{collection: 'users'}
);

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

UserSchema.statics.getUser = function(username, cb) {
    if (username) {
        this.model('User').findOne({username: username}, (err, data) => {
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
    this.model('User').findOne({username: username}, (err, data) => {
        if (err) {return cb(err);}
        if (data) {return cb(null, data._id);}

        var error = new Error('No user with given ID found.');
        return cb(error);
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
