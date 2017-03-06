'use strict';

const mongoose = require('mongoose');
const expect = require('chai').expect;
const User = require('../server/model/user-schema');
const Book = require('../server/model/book-schema');

mongoose.Promise = global.Promise;

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

TestUtils.createUser = function(name) {
    var user = new User();
    user.username = name;
    user.local = {
        username: name,
        password: name
    };
    return user;
};

TestUtils.createBook = function(title) {
    var book = new Book();
    book.title = title;
    return book;

};

module.exports = TestUtils;
