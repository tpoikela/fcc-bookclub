
const expect = require('chai').expect;
const Book = require('../server/model/book-schema.js');

const Utils = require('./test-utils');

const getObjectId = Utils.getObjectId;

Utils.connectTestDb();

describe('BookSchema', function() {

    beforeEach( (done) => {
        Book.remove({}, err => {
            if (err) {throw new Error(err);}
            done();
        });
    });

    afterEach( (done) => {
        Book.remove({}, err => {
            if (err) {throw new Error(err);}
            done();
        });
    });

    it('must have a title and owner', function() {
        var book = new Book();
        book.validateSync();
        expect(book.errors.title).to.exist;
        expect(book.errors.owner).to.exist;
    });

    it('can have its owner changed', function(done) {
        var book = new Book();
        var title = '1001 nights of Arabia';
        book.title = title;
        book.owner = getObjectId();
        var newOwner = getObjectId();

        book.save(book, (err) => {
            if (err) {throw new Error(err);}
            else {
                book.changeOwner(newOwner, err => {
                    if (err) {throw new Error(err);}
                    Book.findOne({title: title}, (err, data) => {
                        if (err) {throw new Error(err);}
                        Utils.expectEqualObjectId(data.owner, newOwner);
                        done();
                    });
                });
            }
        });

    });


});
