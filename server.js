/*
 * Server entry point file for the Book Trading Club app.
 */
'use strict';

const debug = require('debug')('book:server');

loadDotEnv();

// Load required npm modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

// App-specific requires
const routes = require('./server/routes/routes.js');

debug('All requires loaded.');

var app = express();
app.set('view engine', 'pug');

require('./server/config/passport')(passport);

app.url = process.env.APP_URL;
console.log('The full APP url: ' + app.url);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);

// Initialize resource paths for the server
app.use('/build', express.static(process.cwd() + '/build'));
app.use('/ctrl', express.static(process.cwd() + '/server/ctrl'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/server/common'));
app.use('/pug', express.static(process.cwd() + '/pug'));

app.use(helmet());

app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: true
}));

app.locals.pretty = true;

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('combined'));

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log('BookWyrms Server listening on port ' + port + '...');
});

//---------------------------------------------------------------------------
// HELPER FUNCTIONS
//---------------------------------------------------------------------------

function loadDotEnv() {
    // When deployed to heroku, don't use .env
    if (process.env.NODE_ENV !== 'production') {
        debug('BookWyrms server Not in prod. Loading local .env file.');
        require('dotenv').load();
        debug('Loaded .env file OK. Node env: '
        + process.env.NODE_ENV);
    }
    else {
        debug('BookWyrms server Running in PRODUCTION environment');
    }
}

