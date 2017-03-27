# fcc-bookclub

A book trading app/site for freeCodeCamp fullstack projects. See the page
(https://www.freecodecamp.com/challenges/manage-a-book-trading-club) for a full
description of the requirements.

The website is deployed to Heroku: (http://bookwyrms.herokuapp.com).

## Description

A user can signup for the book club. People can trade their (physical) copies of the
books via the website. The website shows a list of all books by all users, and
registered users can click and request a trade.

## Tools/technologies used

The website is a MERN full stack Javascript application. It uses the following
features:

  1. mongodb (via (http://www.mlab.com))
  2. express
  3. react
  4. node.js
  5. pug
  6. gulp
  7. passport.js for signup/logins
  + many more (ctags, eslint, sass-lint)

## Development

To have the application fully working, you need to get an API key from
(https://developers.google.com/books/).

First, clone the repository:

    git clone https://github.com/tpoikela/fcc-bookclub.git

Install required modules:

    npm install

This will build the application automatically. Rename `sample.env` to `.env`.

    mv sample.env .env

Set your mongodb and API key in .env. Then, you can start the server:

    node server

Now you can visit the pages in `localhost:8080`, or whatever port you set.
