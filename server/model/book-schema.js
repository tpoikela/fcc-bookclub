'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

/* BookSchema is used for storing info about all the books in the club. As there
 * can be multiple copies of same title, each "physical" book has a unique ID
 * and owner of course. */
const BookSchema = Schema({

    title: {
        type: String,
        required: true
    },
    volumeInfo: {type: Object},
    year: {
        type: Number
    },
    author: {
        type: String
    },
    thumbnail: {
        type: String
    },
    tradeReqs: {type: Array}

},
{collection: 'books'}
);

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

BookSchema.statics.create = function(obj, cb) {
    var Book = this.model('Book');
    var newBook = new Book();
    newBook.title = obj.volumeInfo.title;
    newBook.volumeInfo = obj.volumeInfo;
    newBook.year = obj.year;

    newBook.author = obj.author;
    newBook.thumbnail = obj.thumbnail;

    newBook.save( (err, data) => {
        if (err) {cb(err);}
        else {cb(null, data);}
    });

};

/* Adds a trade request for given bookId. */
BookSchema.statics.addTradeReq = function(obj, cb) {
    var Book = this.model('Book');
    var updateObj = {
        $push: {tradeReqs: obj.tradeReq}
    };
    Book.update({_id: obj.bookId}, updateObj, err => {
        if (err) {cb(err);}
        else {cb(null);}
    });
};

/* Removes one trade request from a user.*/
BookSchema.statics.removeTradeReq = function(obj, cb) {
    var Book = this.model('Book');
    var tradeReq = obj.tradeReq;

    var pullObj = {
        $pull: {tradeReqs: {
            createdOn: tradeReq.createdOn
        }}
    };

    Book.update({_id: obj._id}, pullObj, (err, data) => {
        if (err) {cb(err);}
        else {
            cb(null, data);
        }
    });
};

//---------------------------------------------------------------------------
// INSTANCE METHODS
//---------------------------------------------------------------------------

/* Updates the book info with given object.*/
BookSchema.methods.update = function(obj, cb) {
    var setVals = {$set: obj};
    this.model('Book').update({_id: this._id}, setVals, {}, (err) => {
        if (err) {cb(err);}
        else {cb(null);}
    });
};

BookSchema.methods.changeOwner = function(userID, cb) {
    var obj = {owner: userID};
    this.update(obj, cb);
};

module.exports = mongoose.model('Book', BookSchema);
