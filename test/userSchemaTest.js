

const expect = require('chai').expect;

const User = require('../server/model/user-schema.js');

describe('UserSchema', function() {

    var user = null;

    beforeEach( () => {
        user = new User();
    });

    afterEach( () => {
        user = null;
    });

    it('should have name and password', function() {
        user.validateSync();
        expect(user.errors.username).to.exist;
        expect(user.errors.password).to.exist;
        expect(user.errors.bookList).to.not.exist;
        expect(user.errors.tradeReqsPending).to.not.exist;
    });


});
