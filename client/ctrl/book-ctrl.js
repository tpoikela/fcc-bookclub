'use strict';

const ajax = require('../common/ajax-functions.js');

/* Client-side book controller which handles communication towards the server,
 * when user wants to add/remove books to/from their profile.
 * */
class BookCtrl {

    constructor(url) {
        this.appUrl = url;
    }

    addBook(bookData, cb) {
        var url = this.appUrl + '/book';
        ajax.post(url, bookData, (err, respText) => {
            if (err) {cb(err);}
            else {
                var respData = JSON.parse(respText);
                cb(null, respData);
            }
        });
    }

    deleteBook(bookData, cb) {
        var url = this.appUrl + '/book';
        ajax.delete(url, bookData, (err, respText) => {
            if (err) {cb(err);}
            else {
                var respData = JSON.parse(respText);
                cb(null, respData);
            }

        });
    }

    /* Gets a list of all books from the server. */
    getAllBooks(cb) {
        var url = this.appUrl + '/book';
        this._ajaxGetBooks(url, cb);
    }

    /* Given username, retrieves all books for that user. This is mainly useful
     * for trade requests. */
    getBooksForUser(username, cb) {
        var url = this.appUrl + '/books/' + username;
        this._ajaxGetBooks(url, cb);
    }

    _ajaxGetBooks(url, cb) {
        ajax.get(url, (err, respText) => {
            if (err) {
                cb(err);
            }
            else {
                try {
                    var books = JSON.parse(respText);
                    cb(null, books);
                }
                catch (e) {
                    var errMsg = 'An error occurred of type: ' + e.toString();
                    cb(errMsg);
                }
            }
        });
    }

}

module.exports = BookCtrl;
