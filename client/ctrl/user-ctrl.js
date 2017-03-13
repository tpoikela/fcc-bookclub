'use strict';

var ajax = require('../common/ajax-functions');

/* UserController handles all communication with the server, so it's decoupled
 * from the React code. */
class UserController {

    constructor(appUrl) {
        this.appUrl = appUrl;
    }

    /* Used for error reporting. */
    reportError(fun, err, url) {
        console.error('userCtrl [ERROR]: ' +
            fun + '(): ' + err + ' url: ' + url);
    }

    /* Sends ajax-get to server to check if user is authenticated. */
    amIAuthenticated(cb) {
        var url = this.appUrl + '/amiauth';
        ajax.get(url, (err, respText) => {
            if (err) {
                this.reportError('amIAuthenticated', err, url);
                cb(err);
            }
            else {
                var data = JSON.parse(respText);
                console.log('userCtrl amIAuthenticated() respText: '
                    + respText);
                cb(null, data);
            }
        });
    }

    /* Requests user profile data from the server.*/
    getUserProfileData(username, cb) {
        var url = this.appUrl + '/user/' + username;
        ajax.get(url, (err, respText) => {
            if (err) {
                this.reportError('getUserProfileData', err, url);
                cb(err);
            }
            else {
                var data = JSON.parse(respText);
                cb(null, data);
            }
        });
    }

    /* Sends updated user info to the server. */
    updateContactInfo(contactInfo, cb) {
        var url = this.appUrl + '/user/update';
        ajax.post(url, contactInfo, (err, respText) => {
            if (err) {
                this.reportError('updateContactInfo', err, url);
                cb(err);
            }
            else {
                var data = JSON.parse(respText);
                cb(null, data);
            }
        });
    }

}

module.exports = UserController;
