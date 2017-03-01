'use strict';

const ajax = require('../common/ajax-functions.js');

/* Client-side book controller which handles communication towards the server.
 * */
class BookCtrl {

    constructor(url) {
        this.appUrl = url;
    }

    addBook(username, book, cb) {
        var obj = {username: username, book: book};
        var url = this.appUrl + '/book';
        ajax.post(url, obj, (err, respText) => {
            if (err) {cb(err);}
            else {
                var respData = JSON.parse(respText);
                cb(null, respData);
            }
        });
    }

}

module.exports = BookCtrl;
