

const expect = require('chai').expect;
const User = require('../server/model/user-schema.js');

const Utils = require('./test-utils');

const getObjectId = Utils.getObjectId;

Utils.connectTestDb();

describe('UserSchema', function() {

    var user = null;

    beforeEach( done => {
        user = new User();
        user.username = 'aaa';
        user.local = {};
        user.local.username = 'aaa';
        user.local.password = 'ccc';
        user.save( err => {
            if (err) {throw new Error(err);}
            done();
        });
    });

    afterEach( (done) => {
        user = null;
        User.remove({}, err => {
            if (err) {throw new Error(err);}
            done();
        });
    });

    it('should have name and password', function() {
        var newUser = new User();
        newUser.validateSync();
        expect(newUser.errors.username).to.exist;
        expect(newUser.errors.local).to.exist;
        expect(newUser.errors.bookList).to.not.exist;
        expect(newUser.errors.tradeReqsPending).to.not.exist;
    });

    it('can have information updated', function(done) {
        var obj = {email: 'aaa@bbb.com', state: 'Florida'};
        var username = {username: 'aaa'};
        User.findOne(username, (err, data) => {
            if (err) {throw new Error(err);}
            else {
                data.update(obj, err => {
                    if (err) {throw new Error(err);}
                    User.findOne(username, (err, userData) => {
                        if (err) {throw new Error(err);}
                        expect(userData.state).to.be.equal('Florida');
                        expect(userData.email).to.be.equal('aaa@bbb.com');
                        done();
                    });
                });
            }
        });
    });

    it('can add one book for the user', function(done) {
        var username = {username: 'aaa'};
        User.findOne(username, (err, data) => {
            if (err) {throw new Error(err);}
            else {
                var book = getObjectId();
                data.addBook(book, err => {
                    if (err) {throw new Error(err);}
                    User.findOne(username, (err, data) => {
                        if (err) {throw new Error(err);}
                        expect(data.bookList.length).to.equal(1);
                        Utils.expectEqualObjectId(data.bookList[0], book);
                        done();
                    });
                });

            }
        });
    });

    it('can have books removed also', function(done) {
        var bookId = getObjectId();
        var username = {username: 'aaa'};
        User.update(username, {$set: {bookList: [bookId]}}, {}, (err) => {
            if (err) {throw new Error(err);}
            else if (user) {
                User.findOne(username, (err, user) => {
                    if (err) {throw new Error(err);}

                    console.log(JSON.stringify(user));
                    expect(user.bookList.length).to.be.equal(1);

                    user.removeBook(bookId, err => {
                        if (err) {throw new Error(err);}
                        User.findOne(username, (err, user) => {
                            if (err) {throw new Error(err);}
                            expect(user.bookList.length).to.be.equal(0);
                            done();
                        });

                    });
                });


            }
            else {
                throw new Error('No user with name ' + username.username);
            }

        });

    });


});
