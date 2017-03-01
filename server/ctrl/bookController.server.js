'use strict';

const Book = require('../model/book-schema.js');

class BookController {

    /* Adds one book to the database.*/
    addBook(book, cb) {
        Book.create(book, (err, data) => {
            if (err) {cb(err);}
            else {
                cb(null, data);
            }
        });
    }

}

module.exports = BookController;
