'use strict';

const User = require('../model/user-schema');
const Book = require('../model/book-schema');
const debug = require('debug')('book:trade-ctrl');

const _json = obj => {return JSON.stringify(obj);};

const createTradeReq = (username, book) => {
    return {
        createdOn: new Date(),
        from: username,
        book: book,
        state: 'Pending'
    };

};

/* TradeController adds and removes trade requests from the DB. It also
 * processes accepted and rejected trade requests.*/
class TradeController {

    /* Adds one trade request into the system. */
    addTradeReq(username, reqBody, cb) {
        var book = reqBody.book;
        var tradeReq = createTradeReq(username, book);

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
    removeTradeReq(username, reqBody, cb) {
        var err;
        var tradeReq = reqBody.tradeReq;
        if (tradeReq) {
            var book = tradeReq.book;
            if (book) {
                debug('Removing tradeReq from user ' + username);
                User.removeTradeReq(username, tradeReq, err => {
                    if (err) {cb(err);}
                    else {
                        var obj = {_id: book._id, tradeReq: tradeReq};
                        Book.removeTradeReq(obj, err => {
                            if (err) {cb(err);}
                            else {cb(null);}
                        });
                    }
                });
            }
            else {
                err = new Error('No book in tradeReq');
                cb(err);
            }
        }
        else {
            err = new Error('No tradeReq in req.body');
            cb(err);
        }
    }

    /* Accepts a tradeReq. Note that the username here is the accepting user and
     * not the one who requested the trade. */
    acceptTradeReq(username, reqBody, cb) {
        var tradeReq = reqBody.tradeReq;
        var reqOwner = tradeReq.from;
        User.acceptTradeReq(reqOwner, tradeReq, err => {
            if (err) {cb(err);}
            else {
                // Modify the req state in the book

            }
        });
    }

    /* rejectTradeReq(username, reqBody, cb) {

    }*/

}

module.exports = TradeController;
