

const expect = require('chai').expect;

const BookSearch = require('../server/common/book-search');

require('dotenv').load();

describe('BookSearch', function() {

    it('Finds books via external API based on user input', function(done) {
        var bookSearch = new BookSearch({apiKey: process.env.API_KEY});
        bookSearch.search({word: 'Lord of the Rings'}, (err, resp, body) => {
            expect(err).to.be.null;
            done();
        });
    });
});
