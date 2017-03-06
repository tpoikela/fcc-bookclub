'use strict';

const User = require('../model/user-schema');
const Book = require('../model/book-schema');
const debug = require('debug')('book:trade-ctrl');

const _json = obj => {return JSON.stringify(obj);};

/* TradeController adds and removes trade requests from the DB. It also
 * processes accepted and rejected trade requests.*/
class TradeController {

    /* Adds one trade request into the system. */
    addTradeReq(username, reqBody, cb) {
        var book = reqBody.book;
        var tradeReq = {
            createdOn: new Date(),
            from: username,
            book: book
        };

        debug('Adding req ' + _json(tradeReq) + ' for user ' + username);
        User.addTradeReq(username, tradeReq, err => {
            if (err) {cb(err);}
            else {
                var obj = {bookId: book._id, tradeReq: tradeReq};
                debug('Added req ' + _json(tradeReq) + ', user ' + username);
                Book.addTradeReq(obj, err => {
                    if (err) {
                        cb(err);
                        // TODO what happens to the User's tradeReq?
                    }
                    else {
                        debug('Req ' + _json(tradeReq) + ', book ' + book._id);
                        cb(null);
                    }
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
