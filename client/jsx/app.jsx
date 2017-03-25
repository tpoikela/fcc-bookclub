
'use strict';

const ProfileTop = require('./profile.jsx');
const BooksTop = require('./books-top.jsx');

var profileTop = document.querySelector('#profile-app');
var booksTop = document.querySelector('#books-app');

const React = require('react');
const ReactDOM = require('react-dom');

if (profileTop) {
    ReactDOM.render(<ProfileTop />, profileTop);
}
else if (booksTop) {
    ReactDOM.render(<BooksTop />, booksTop);
}

