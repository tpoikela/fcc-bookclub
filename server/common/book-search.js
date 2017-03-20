'use strict';

const debug = require('debug')('book:book-search');

// Example of the Google books API call:
// https://www.googleapis.com/books/v1/volumes?
// q=flowers+inauthor:keyes&key=yourAPIKey

const request = require('request');

class BookSearch {

    /* Throws error unless API key is given.*/
    constructor(obj) {
        if (typeof obj === 'object') {
            this.apiKey = obj.apiKey;
            this.baseUrl = 'https://www.googleapis.com/books/v1/volumes';
            if (!this.apiKey) {
                throw new Error('apiKey must be given!');
            }
        }
        else {
            throw new Error('Constr takes object as first arg');
        }
    }

    /* Searches for the book using obj.word using external Google Books API.*/
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

            if (error) {
                cb(error);
            }
            else if (body) {
                try {
                    var bodyParsed = JSON.parse(body);
                    this.removeBookFields(bodyParsed, ['description']);
                    cb(null, bodyParsed);
                }
                catch (e) {
                    cb(e);
                }
            }
            else {
                var err = new Error('BookSearch No resp body detected.');
                cb(err);
            }
        });
    }

    /* Removes the description field from a book.*/
    removeBookFields(body, fields) {
        var books = body.items;
        books.forEach( book => {
            fields.forEach( field => {
                delete book[field];
            });
        });
    }

}


module.exports = BookSearch;
