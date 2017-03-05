'use strict';

const Book = require('../model/book-schema');
const User = require('../model/user-schema');

/* Server-side book controller which manipulates the books stored in the
 * database.
 */
class BookController {

    /* Returns all books in the database.*/
    getBooks(username, cb) {
        Book.find({}, (err, data) => {
            if (err) {cb(err);}
            else {
                cb(null, data);
            }
        });
    }

    /* Adds one book to the database and for the user.*/
    addBook(updateObj, cb) {
        User.getUser(updateObj.username, (err, user) => {
            if (err) {cb(err);}
            else {
                var obj = {title: updateObj.title};
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
    deleteBook(updateObj, cb) {
        var username = updateObj.username;
        var book = updateObj.book;
        User.findOne({username: username}, (err, user) => {
            if (err) {cb(err);}
            else if (!user) {
                var error = new Error('No user |' + username + '|');
                cb(error);
            }
            else {
                user.removeBook(book._id, err => {
                    if (err) {cb(err);}
                    else {
                        Book.remove({_id: book._id}, err => {
                            if (err) {cb(err);}
                            else {
                                cb(null);
                            }
                        });
                    }
                });
            }
        });
    }

}

module.exports = BookController;
