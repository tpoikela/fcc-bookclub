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

}

module.exports = BookCtrl;
