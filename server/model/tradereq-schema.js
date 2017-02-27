
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

// TradeReqSchema.statics.statusTypes = ['PENDING', 'ACCEPTED', 'REJECTED'];

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

/* Creates one trade request into the database.*/
TradeReqSchema.statics.createReq = function(obj, cb) {
    var TradeReq = this.model('TradeReq');
    var tradeReq = new TradeReq(
        {fromUser: obj.from, toUser: obj.to, requestedBook: obj.book}
    );

    tradeReq.save( (err, data) => {
        if (err) {cb(err);}
        else {cb(null, data);}
    });
};

//---------------------------------------------------------------------------
// INSTANCE METHODS
//---------------------------------------------------------------------------

/* Updates the object information.*/
TradeReqSchema.methods.update = function(obj, cb) {
    var setVals = {$set: obj};
    this.model('TradeReq').update({_id: this._id}, setVals, {}, err => {
        if (err) {cb(err);}
        else {
            cb(null);
        }
    });
};

 module.exports = mongoose.model('TradeReq', TradeReqSchema);
