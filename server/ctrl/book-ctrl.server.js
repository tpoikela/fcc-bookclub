'use strict';

const Book = require('../model/book-schema');
const User = require('../model/user-schema');

/* Server-side book controller which manipulates the books stored in the
 * database.
 */
class BookController {

    /* Adds one book to the database and for the user.*/
    addBook(book, cb) {
        User.getUser(book.username, (err, user) => {
            if (err) {cb(err);}
            else {
                var obj = {title: book.book, owner: user._id};
                Book.create(obj, (err, bookData) => {
                    if (err) {cb(err);}
                    else {
                        user.addBook(bookData._id, err => {
                            if (err) {cb(err);}
                            else {
                                cb(null, bookData);
                            }

                        });

                    }
                });

            }

        });
    }

    /* Deletes one book from the book collection and removes it also from the
     * user.*/
    deleteBook(book, cb) {
        User.getUser(book.username, (err, user) => {
            if (err) {cb(err);}
        });

    }

}

module.exports = BookController;
