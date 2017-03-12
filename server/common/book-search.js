'use strict';

// https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey
//

const request = require('request');

class BookSearch {

    constructor(obj) {
        this.apiKey = obj.apiKey;
        this.baseUrl = "https://www.googleapis.com/books/v1/volumes";
    }

    search(obj, cb) {
        var query = '?q=' + obj.word;
        var key = 'key=' + this.apiKey;
        var url = this.baseUrl + query + '&' + key;
        request.get(url, (error, resp, body) => {
            console.log('error: ' + error);
            console.log('resp ' + JSON.stringify(resp));
            console.log('body: ' + body);
            cb(error, resp, body);
        });
    }

};


module.exports = BookSearch;
