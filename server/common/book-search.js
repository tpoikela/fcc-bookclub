'use strict';

const debug = require('debug')('book:book-search');

// Example of the Google books API call:
// https://www.googleapis.com/books/v1/volumes?
// q=flowers+inauthor:keyes&key=yourAPIKey

const request = require('request');

class BookSearch {

    constructor(obj) {
        if (typeof obj === 'object') {
            this.apiKey = obj.apiKey;
            this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
            if (!this.apiKey) {
                throw new Error('apiKey must be given!');
            }
        }
        else {
            throw new Error('Constr takes only object');
        }
    }

    search(obj, cb) {
        var query = '?q=' + obj.word;
        var key = 'key=' + this.apiKey;
        var url = this.baseUrl + query + '&' + key;
        request.get(url, (error, resp, body) => {
            if (!error) {
                debug('Book search with |' + url + '| completed OK');
            }
            else {
                debug('Book search error: ' + error);
            }
            if (body) {
                try {
                    var bodyParsed = JSON.parse(body);
                    cb(null, bodyParsed);
                }
                catch (e) {
                    cb(e);
                }
            }
        });
    }

}


module.exports = BookSearch;
