'use strict';

var ajax = require('../common/ajax-functions');

/* UserController handles all communication with the server, so it's decoupled
 * from the React code. */
class UserController {

    constructor(appUrl) {
        this.appUrl = appUrl;
    }

    /* Used for error reporting when API call fails. */
    reportAPIError(fun, err, url) {
        console.error('userCtrl [ERROR]: ' +
            fun + '(): ' + err + ' url: ' + url);
    }

    /* Used to report internal errors.*/
    error(comp, err) {
        console.error('userCtrl [INT_ER] ' + err);
        comp.setState({error: err});
    }

    /* Sends ajax-get to server to check if user is authenticated. */
    amIAuthenticated(cb) {
        var url = this.appUrl + '/users/amiauth';
        ajax.get(url, (err, respText) => {
            if (err) {
                this.reportAPIError('amIAuthenticated', err, url);
                cb(err);
            }
            else {
                var data = JSON.parse(respText);
                cb(null, data);
            }
        });
    }

    /* Requests user profile data from the server.*/
    getUserProfileData(username, cb) {
        var url = this.appUrl + '/users/' + username;
        ajax.get(url, (err, respText) => {
            if (err) {
                this.reportAPIError('getUserProfileData', err, url);
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
        var url = this.appUrl + '/users/update';
        ajax.post(url, contactInfo, (err, respText) => {
            if (err) {
                this.reportAPIError('updateContactInfo', err, url);
                cb(err);
            }
            else {
                var data = JSON.parse(respText);
                cb(null, data);
            }
        });
    }

    checkAuthentication(comp) {
        this.amIAuthenticated( (err, data) => {
            if (err) {
                this.error(comp, err);
            }
            else {
                this.getUserInfo(comp, data);
            }
        });
    }

    getUserInfo(comp, authData) {
        var username = authData.username;
        if (username) {
            this.getUserProfileData(username, (err, data) => {
                if (err) {this.error(err);}
                else {
                    comp.setState({
                        username: authData.username,
                        userID: authData.userID,
                        userdata: data
                    });
                }
            });
        }
    }

}

module.exports = UserController;
