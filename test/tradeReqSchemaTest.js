
const mongoose = require('mongoose');
const expect = require('chai').expect;
const TradeReq = require('../server/model/tradereq-schema');

var testDbURI = 'mongodb://localhost:27017/bookwyrmstest';
mongoose.Promise = global.Promise;
mongoose.connect(testDbURI);

function getObjectId() {
    return mongoose.Types.ObjectId();
}

function createTradeReq() {
    return {
        from: getObjectId(),
        to: getObjectId(),
        book: 'xxx yyy zzz'
    };
}

/* Unit tests for TradeReqSchema. */
describe('TradeReqSchema', function() {


    beforeEach( () => {
        // tradeReq = new TradeReq();
    });

    afterEach( () => {
        // tradeReq = null;
        TradeReq.remove({});
    });

    it('has two users and a book requested', function(done) {
        var tradeReq = new TradeReq();
        tradeReq.validateSync();
        console.log(JSON.stringify(tradeReq.errors));
        expect(tradeReq.errors.fromUser).to.exist;
        expect(tradeReq.errors.toUser).to.exist;
        expect(tradeReq.errors.requestedBook).to.exist;
        done();
    });

    it('creates a new object into the database', function(done) {
        var testUser = getObjectId();
        var toUser = getObjectId();

        var obj = {
            from: testUser,
            to: toUser,
            book: 'XXX Book'
        };

        TradeReq.createReq(obj, function(err) {
            if (err) {throw new Error(err);}
            expect(err, 'create() should succeed').to.be.null;

            TradeReq.findOne({fromUser: testUser}, (err, data) => {
                expect(err, 'findOne must not fail').to.be.null;
                expect(data, 'Data must not be null').not.to.be.null;
                expect(data.toUser.toString()).to.be.equal(toUser.toString());
                done();
            });
        });

    });

    it('can update data inside the database', function(done) {
        var obj = createTradeReq();

        TradeReq.createReq(obj, (err, data) => {
            if (err) {throw new Error(err);}
            data.update({tradedBook: 'abcdefg'}, err => {
                expect(err).to.be.null;

                TradeReq.findOne({_id: data._id}, (err, foundData) => {
                    if (err) {throw new Error(err);}
                    expect(foundData.tradedBook).to.be.equal('abcdefg');
                    done();
                });
            });
        });
    });

    it('can remove data inside the database', function(done) {
        var obj = createTradeReq();
        TradeReq.createReq(obj, (err, data) => {
            if (err) {throw new Error(err);}
            var id = data._id;
            TradeReq.removeByID(id, err => {
                if (err) {throw new Error(err);}
                expect(err).to.be.null;

                TradeReq.findOne({_id: data._id}, (err, foundData) => {
                    if (err) {throw new Error(err);}
                    expect(foundData,
                        'Removed data should not be found').to.be.null;
                    done();
                });

            });
        });

    });

    it('can be rejected by a user', function(done) {
        createDummyReq( data => {
            data.reject( err => {
                if (err) {throw new Error(err);}
                else {
                    TradeReq.findOne({_id: data._id}, (err, foundData) => {
                        if (err) {throw new Error(err);}
                        expect(foundData.tradeStatus).to.be.equal('REJECTED');
                        done();
                    });
                }
            });
        });
    });

});

function createDummyReq(cb) {
    var obj = createTradeReq();
    TradeReq.createReq(obj, (err, data) => {
        if (err) {throw new Error(err);}
        else {
            cb(data);
        }
    });
}
