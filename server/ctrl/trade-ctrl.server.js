'use strict';

const User = require('../model/user-schema');
const Book = require('../model/book-schema');

class TradeController {

    /* Adds one trade request into the system. */
    addTradeReq(username, reqBody, cb) {
        var book = reqBody.book;
        var tradeReq = {
            createdOn: new Date(),
            from: username,
            book: book
        };

        User.addTradeReq(username, tradeReq, err => {
            if (err) {cb(err);}
            else {
                var obj = {bookId: book._id, tradeReq: tradeReq};
                Book.addTradeReq(obj, err => {
                    if (err) {
                        cb(err);
                        // TODO what happens to the User's tradeReq?
                    }
                    else {cb(null);}
                });
            }
        });
    }

    /* Removes a trade request from the given user.*/
    /* removeTradeReq(username, reqBody, cb) {

    }*/

    /* acceptTradeReq(username, reqBody, cb) {

    }*/

    /* rejectTradeReq(username, reqBody, cb) {

    }*/

}

module.exports = TradeController;
