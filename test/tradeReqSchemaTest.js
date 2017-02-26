
const expect = require('chai').expect;
const TradeReq = require('../server/model/tradereq-schema');

describe('TradeReqSchema', function() {

    var tradeReq = null;

    beforeEach( () => {
        tradeReq = new TradeReq();
    });

    afterEach( () => {
        tradeReq = null;
    });

    it('has two users and a book requested', function() {
        tradeReq.validateSync();

    });

});
