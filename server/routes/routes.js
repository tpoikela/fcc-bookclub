'use strict';

var path = process.cwd();
var ctrlPath = path + '/server/ctrl';

const UserController = require(ctrlPath + '/user-ctrl.server.js');
const BookController = require(ctrlPath + '/book-ctrl.server.js');
const debug = require('debug')('book-routes');

var _log = function(msg) {
    console.log('[LOG@SERVER]: ' + msg);
};

/* Function for debug logging requests.*/
var reqDebug = function(req) {
	_log('\t\tHeaders: ' + JSON.stringify(req.headers));
	_log('\t\tBody: ' + JSON.stringify(req.body));
	_log('\t\tParams: ' + JSON.stringify(req.params));
	_log('\t\tUrl:' + JSON.stringify(req.url));
	_log('\t\tText:' + JSON.stringify(req.text));
	_log('\t\tContent:' + JSON.stringify(req.content));
	_log('\t\tQuery:' + JSON.stringify(req.query));
};

var notAuthorized = {msg: 'Operation not authorized. Log in first.'};
var errorInternal = {msg: 'Server internal error.'};
var errorForbidden = {msg: 'Requested action forbidden.'};

module.exports = function(app, passport) {

    /* Renders a pug template.*/
    var renderPug = function(req, res, pugFile) {
        var isAuth = req.isAuthenticated();
        res.render(path + '/pug/' + pugFile, {isAuth: isAuth});
    };

    /* loggedIn func from clementine.js. */
	var isLoggedIn = function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
        else {
			return res.redirect('/login');
		}
	};

    var logErrorReq = function(req) {
        console.error('Error REQ headers: ');
        reqDebug(req);
    };

    /* Logs an error with route and request information included.*/
    var logError = function(route, err, req) {
        var date = new Date();
        console.error(date + ' [ERROR@SERVER] route ' + route + ' | ' + err);
        if (req) {
            logErrorReq(req);
        }
    };

    // CONTROLLERS
    var userController = new UserController(path);
    var bookController = new BookController(path);

    //----------------------------------------------------------------------
    // ROUTES
    //----------------------------------------------------------------------

	app.route('/')
		.get((req, res) => {
            renderPug(req, res, 'index.pug');
		});

	app.route('/about')
		.get((req, res) => {
            renderPug(req, res, 'about.pug');
		});

	app.route('/signup')
		.get((req, res) => {
            renderPug(req, res, 'signup.pug');
		});

	app.route('/login')
		.get((req, res) => {
            renderPug(req, res, 'login.pug');
		});

	app.route('/loginFailed')
		.get((req, res) => {
            res.render(path + '/pug/login.pug',
                {isAuth: false, loginFailed: true});
        });

    // If a user logs out, return to main page
	app.route('/logout')
		.get((req, res) => {
			req.logout();
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, (req, res) => {
            renderPug(req, res, 'profile.pug');
		});

    // Handle registration of user
    app.route('/forms/signup')
        .post((req, res) => {
            debug('Got a signup form GET request..');
            // reqDebug(req);
            userController.addLocalUser(req, res);
        });

    // Called by client to check their authentication status
	app.route('/amiauth')
		.get((req, res) => {
            var data = {isAuth: false};
            if (req.isAuthenticated()) {
                data.isAuth = true;
                data.username = req.user.username;
                userController.getUserID(data.username, (err, userID) => {
                    if (err) {
                        logError('/amiauth', err, req);
                        res.json({error: 'Failed to authenticate'});
                    }
                    else {
                        data.userID = userID;
                        res.json(data);
                    }
                });
            }
            else {
                res.json(data);
            }
		});

    //----------------------------------
    // Routes for manipulating user data
    //----------------------------------

    app.route('/user/:name')
        .get(isLoggedIn, (req, res) => {
            var username = req.params.name;
            if (username === req.user.username) {
                userController.getUserByName(username, (err, data) => {
                    if (err) {
                        logError('/user/' + username, err, req);
                        res.status(500).json(errorInternal);
                    }
                    else {
                        delete data.local.password;
                        res.json(data);
                    }
                });
            }
            else {
                // Forbidden
                logError('/user/' + username,
                    'Forbidden action attempted.', req);
                res.status(403).json(errorForbidden);
            }
        });

    //--------------------------------------
    // Routes for the book data
    //--------------------------------------
    app.route('/book')
        .post(isLoggedIn, (req, res) => {
            var username = req.body.username;
            var book = req.body.title;
            _log('Server got POST-req to /book. USer: ' + username);
            if (username === req.user.username) {
                var bookData = {username: username, book: book};
                bookController.addBook(bookData, (err, bookData) => {
                    if (err) {
                        logError('POST /book/' + book, err, req);
                        res.status(500).json(errorInternal);
                    }
                    else {
                        console.log('bookData is ' + JSON.stringify(bookData));
                        res.status(200).json(bookData);
                    }
                });
            }
            else {
                res.status(403).json(notAuthorized);
            }
        })
        .delete(isLoggedIn, (req, res) => {
            if (req.body) {
                var bookData = req.body;
                debug('Server got DELETE-req to /book. Data: '
                    + JSON.stringify(bookData));
                bookController.deleteBook(bookData, (err) => {
                    if (err) {
                        logError('DELETE /book/' + bookData, err, req);
                        res.status(500).json(errorInternal);
                    }
                    else {
                        res.status(200).json({msg: 'OK'});
                    }
                });
            }
            else {
                res.status(400).json({msg: 'No proper body in DELETE'});
            }

        });

    //--------------------------------------
    // User registration and authentication
    //--------------------------------------

	app.route('/api/:id')
		.get((req, res) => {
            userController.getUser(req, res);
		});

    // Logs user in via form (after successful authentication
	app.route('/auth/userlogin')
        .post(passport.authenticate('local',
            { failureRedirect: '/loginFailed' }),
		(req, res) => {
			res.redirect('/');
		});

};
