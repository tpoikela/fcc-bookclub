'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/* BookSchema is used for storing info about all the books in the club. As there
 * can be multiple copies of same title, each "physical" book has a unique ID
 * and owner of course. */
const BookSchema = Schema({

    title: {
        type: String,
        required: true
    },

    year: {
        type: Number
    },
    author: {
        type: String
    },
    thumbnail: {
        type: String
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    tradeReqs: [{type: ObjectId, ref: 'TradeReq'}]

},
{collection: 'books'}
);

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

BookSchema.statics.create = function(obj, cb) {
    var Book = this.model('Book');
    var newBook = new Book();
    newBook.title = obj.title;
    newBook.year = obj.year;
    newBook.owner = obj.owner;
    newBook.author = obj.author;
    newBook.thumbnail = obj.thumbnail;

    newBook.save( (err, data) => {
        if (err) {cb(err);}
        else {cb(null, data);}
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
