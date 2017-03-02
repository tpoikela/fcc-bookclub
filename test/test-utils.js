

const mongoose = require('mongoose');
const expect = require('chai').expect;

var TestUtils = {

    getObjectId: function() {
        return mongoose.Types.ObjectId();
    },

    expectEqualObjectId: function(got, exp) {
        var msg = 'Object IDs match';
        expect(got.toString(), msg).to.be.equal(exp.toString());
    },

    connectTestDb: function() {
        var testDbURI = 'mongodb://localhost:27017/bookwyrmstest';
        mongoose.Promise = global.Promise;
        mongoose.connect(testDbURI);
    },

    clearTestDb: function(coll, cb) {
        mongoose.connection.db.dropCollection(coll, cb);
    }
};

TestUtils.createTradeReq = function() {
    return {
        from: TestUtils.getObjectId(),
        to: TestUtils.getObjectId(),
        book: TestUtils.getObjectId()
    };
};

module.exports = TestUtils;
