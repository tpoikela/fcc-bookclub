
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
        type: String
    },
    tradedBook: {
        type: String
    },
    fromUser: {
        type: ObjectId,
        ref: 'User'
    },
    toUser: {
        type: ObjectId,
        ref: 'User'
    },

    tradeStatus: {
        type: String
    }

},
{collection: 'tradereqs'}
);

TradeReqSchema.statics.statusTypes = ['PENDING', 'ACCEPTED', 'REJECTED'];

//---------------------------------------------------------------------------
// STATIC METHODS
//---------------------------------------------------------------------------

//---------------------------------------------------------------------------
// INSTANCE METHODS
//---------------------------------------------------------------------------

module.exports = mongoose.model('TradeReq', TradeReqSchema);
