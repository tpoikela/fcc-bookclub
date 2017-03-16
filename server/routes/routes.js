'use strict';

var path = process.cwd();
var ctrlPath = path + '/server/ctrl';

const UserController = require(ctrlPath + '/user-ctrl.server.js');
const BookController = require(ctrlPath + '/book-ctrl.server.js');
const TradeController = require(ctrlPath + '/trade-ctrl.server.js');
const BookSearch = require('../common/book-search');
const debug = require('debug')('book:routes');

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

const _u = function(username) {
    return '|' + username + '|';
};

// Msg objects sent back to the client
var notAuthorized = {msg: 'Operation not authorized. Log in first.'};
var errorInternal = {msg: 'Server internal error.'};
var errorForbidden = {msg: 'Requested action forbidden.'};
var requestOk = {msg: 'Request was completed OK.'};

/* Contains all routes for this application. */
module.exports = function(app, passport) {

    /* Renders a pug template.*/
    var renderPug = function(req, res, pugFile) {
        var isAuth = req.isAuthenticated();
        debug('renderPug auth: ' + isAuth + ' file: ' + pugFile);
        res.render(path + '/pug/' + pugFile, {isAuth: isAuth});
    };

    /* loggedIn func from clementine.js. */
	var isLoggedIn = function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
        else {
            debug('Redirecting non-auth user to /login');
			return res.redirect('/login');
		}
	};

    /* Returns the username from the request. Logs an error if username is not
     * present. */
    var getUserName = function(req, route) {
        if (req.user) {
            if (req.user.username) {
                return req.user.username;
            }
            else {
                logError(route, 'getUserName: No req.user.username exists.',
                    req);
            }
        }
        else {
            logError(route, 'getUserName: No req.user exists.', req);
        }
        return null;
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

    var debugJSON = function(msg, obj) {
        debug(msg + ' ' + JSON.stringify(obj));
    };

    // CONTROLLERS
    var userController = new UserController(path);
    var bookController = new BookController(path);
    var tradeController = new TradeController(path);

    var bookSearch = new BookSearch({apiKey: process.env.API_KEY});

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

	app.route('/allbooks')
		.get((req, res) => {
            renderPug(req, res, 'books.pug');
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
            userController.addLocalUser(req, res);
        });

    //----------------------------------------------------
    // /users/ Routes for accessing/manipulating user data
    //----------------------------------------------------

    // Called by client to check their authentication status
	app.route('/users/amiauth')
		.get((req, res) => {
            var data = {isAuth: false};
            if (req.isAuthenticated()) {
                data.isAuth = true;
                data.username = req.user.username;
                userController.getUserID(data.username, (err, userID) => {
                    if (err) {
                        logError('/users/amiauth', err, req);
                        res.status(500).json({error: 'Failed to authenticate'});
                    }
                    else {
                        data.userID = userID;
                        res.status(200).json(data);
                    }
                });
            }
            else {
                res.status(200).json(data);
            }
		});


    app.route('/users/:name')
        .get(isLoggedIn, (req, res) => {
            var username = req.params.name;
            if (username === req.user.username) {
                userController.getUserByName(username, (err, data) => {
                    if (err) {
                        logError('/users/' + username, err, req);
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
                logError('/users/' + username,
                    'Forbidden action attempted.', req);
                res.status(403).json(errorForbidden);
            }
        });

    app.route('/users/update')
        .post(isLoggedIn, (req, res) => {
            var username = getUserName(req, '/user/update');
            var userInfo = req.body;
            debugJSON('/users/update ' + _u(username) + ' info: ', userInfo);
            userController.updateUserInfo(username, userInfo, (err, data) => {
                if (err) {
                    logError('/users/update', err, req);
                    res.status(500).json(errorInternal);
                }
                else {
                    res.json(data);
                }
            });
        });

    //--------------------------------------
    // Routes for the book data
    //--------------------------------------
    app.route('/books')

        .get(isLoggedIn, (req, res) => {
            var username = req.user.username;
            bookController.getBooks(username, (err, data) => {
                if (err) {
                    logError('GET /books/', err, req);
                    res.status(500).json(errorInternal);
                }
                else {
                    res.status(200).json(data);
                }
            });
        })

        .post(isLoggedIn, (req, res) => {
            var username = req.body.username;
            var book = req.body.book;
            _log('Server got POST-req to /books. User: ' + _u(username));

            if (username === req.user.username) {
                var bookData = {username: username, book: book};
                bookController.addBook(bookData, (err, bookData) => {
                    if (err) {
                        var title = book.volumeInfo.title;
                        logError('POST /books/' + title, err, req);
                        res.status(500).json(errorInternal);
                    }
                    else {
                        debug('bookData is ' + JSON.stringify(bookData));
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
                var updateObj = {
                    username: req.user.username,
                    book: bookData
                };
                debug('Server got DELETE-req to /books. Data: '
                    + JSON.stringify(bookData));
                bookController.deleteBook(updateObj, (err) => {
                    if (err) {
                        logError('DELETE /books/' + bookData, err, req);
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

    /* Route for handling book searches via external API.*/
    app.route('/books/search')
        .post(isLoggedIn, (req, res) => {
            var username = req.user.username;
            var search = req.body.search;
            debugJSON('/POST /books/search ', req.body);

            if (search) {
                bookSearch.search({word: search}, (err, data) => {
                        if (err) {
                            logError('POST /books/search with ' + username);
                            res.status(500).json(errorInternal);

                        }
                        else {
                            res.status(200).json(data);
                        }
                    });
            }
            else {
                res.status(400).json({msg: 'search post-param not found'});
            }

        });

    /* Returns all books owned by the given user. */
    app.route('/books/:username')
        .get(isLoggedIn, (req, res) => {
            var username = req.params.username;
            debug('/books/:username with ' + username);
            bookController.getBooksForUser(username, (err, books) => {
                if (err) {
                    logError('GET /books/:username with ' + username);
                    res.status(500).json(errorInternal);
                }
                else {
                    var respObj = {books: books};
                    res.status(200).json(respObj);
                }
            });
        });

    //----------------------------------
    // Routes for Trade Requests
    //----------------------------------

    /* Accepts tradeReq. */
    app.route('/tradereq/accept')
        .post(isLoggedIn, (req, res) => {
            var username = getUserName(req, '/tradereq/accept');
            tradeController.acceptTradeReq(username, req.body, err => {
                if (err) {
                    logError('POST /tradereq/accept', err, req);
                    res.status(500).json(errorInternal);
                }
                else {
                    debug('accept user ' + _u(username));
                    res.status(200).json(requestOk);
                }

            });

        });

    /* Rejects tradeReq. */
    app.route('/tradereq/reject')
        .post(isLoggedIn, (req, res) => {
            var username = getUserName(req, 'tradereq/reject');
            tradeController.rejectTradeReq(username, req.body, err => {
                if (err) {
                    logError('POST /tradereq/reject', err, req);
                    res.status(500).json(errorInternal);
                }
                else {
                    debug('reject user ' + _u(username));
                    res.status(200).json(requestOk);
                }
            });
        });

    /* Add/delete tradeReqs. */
    app.route('/tradereq')

        .post(isLoggedIn, (req, res) => {
            var username = getUserName(req, '/tradereq');
            tradeController.addTradeReq(username, req.body, err => {
                if (err) {
                    logError('POST /tradereq', err, req);
                    res.status(500).json(errorInternal);
                }
                else {
                    res.status(200).json(requestOk);
                }
            });
        })

        .delete(isLoggedIn, (req, res) => {
            var username = getUserName(req, '/tradereq');
            debug('delete /tradereq, for user ' + _u(username));
            tradeController.removeTradeReq(username, req.body, err => {
                if (err) {
                    logError('DELETE /tradereq', err, req);
                    res.status(500).json(errorInternal);
                }
                else {
                    res.status(200).json(requestOk);
                }
            });
        });

    //--------------------------------------
    // User registration and authentication
    //--------------------------------------

    // Logs user in via form (after successful authentication)
	app.route('/auth/userlogin')
        .post(passport.authenticate('local',
            { failureRedirect: '/loginFailed' }), (req, res) => {
			res.redirect('/');
		});

};
