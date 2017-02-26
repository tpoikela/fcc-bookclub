'use strict';

var path = process.cwd();
var ctrlPath = path + '/server/ctrl';

const UserController = require(ctrlPath + '/userController.server.js');

var $DEBUG = 0;

var _log = function(msg) {
    console.log('\t' + msg);
};

/* Function for debug logging requests.*/
var reqDebug = function(req) {
	_log('Headers: ' + JSON.stringify(req.headers));
	_log('Body: ' + JSON.stringify(req.body));
	_log('Params: ' + JSON.stringify(req.params));
	_log('Url:' + JSON.stringify(req.url));
	_log('Text:' + JSON.stringify(req.text));
	_log('Content:' + JSON.stringify(req.content));
	_log('Query:' + JSON.stringify(req.query));
};

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

    var logError = function(route, err) {
        console.error('[ERROR@SERVER] route ' + route + ' | ' + err);
    };

    // CONTROLLERS
    var userController = new UserController(path);

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
            if ($DEBUG) {
                console.log('Got a signup form GET request..');
                reqDebug(req);
            }
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
                        logError('/amiauth', err);
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
                // TODO send actual user profile data
                userController.getUserByName(username, (err, data) => {
                    if (err) {
                        logError('/user/' + username, err);
                        res.sendStatus(500);
                    }
                    else {
                        // TODO don't send password
                        res.json(data);
                    }
                });
            }
            else {
                // Forbidden
                res.sendStatus(403);
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
