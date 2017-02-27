
'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

/* Schema for the trade requests between two users. */
var TradeReqSchema = new Schema({

    dateRequested: {
        type: Date
    },
    dateResponded: {
        type: Date
    },
    requestedBook: {
        type: String,
        required: true
    },
    tradedBook: {
        type: String
    },
    fromUser: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    tradeStatus: {
        type: String
    }

},
{collection: 'tradereqs'}
);

const TradeReq = mongoose.model('TradeReq', TradeReqSchema);

TradeReqSchema.statics.statusTypes = ['PENDING', 'ACCEPTED', 'REJECTED'];

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

TradeReqSchema.statics.create = function(obj, cb) {
    var tradeReq = new TradeReq();
    tradeReq.from = obj.from;
    tradeReq.to = obj.to;
    tradeReq.requestedBook = obj.book;
    tradeReq.save( err => {
        cb(err);
    });
};

//---------------------------------------------------------------------------
// INSTANCE METHODS
//---------------------------------------------------------------------------

/* Updates the object information.*/
TradeReq.methods.update = function(obj, cb) {
    var setVals = {$set: obj};
    TradeReq.update({_id: this._id}, setVals, {}, (err) => {
        if (err) {cb(err);}
        else {
            cb(null);
        }
    });
};

module.exports = TradeReq;
