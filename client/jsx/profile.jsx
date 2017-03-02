'use strict';

var React = require('react');

const appUrl = window.location.origin;
const ajax = require('../common/ajax-functions.js');
const UserCtrl = require('../ctrl/user-ctrl');
const BookCtrl = require('../ctrl/book-ctrl');
const ProfileBookList = require('./book-list');
const AddBook = require('./add-book');

/* This component is used at the profile page of a user.*/
class ProfileTop extends React.Component {

    constructor(props) {
        super(props);
        this.userCtrl = new UserCtrl(appUrl);
		this.bookCtrl = new BookCtrl(appUrl);

        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.addBook = this.addBook.bind(this);

        this.state = {
            userdata: null,
            username: null,
            userID: null,
            error: null
        };
    }

    log(msg) {
        console.log('ProfileTop [LOG]: ' + msg);
    }

    jsonLog(msg, obj) {
        var fullMsg = (msg + ': ' + JSON.stringify(obj));
        this.log(fullMsg);
    }

    /* Removes a book from the user. */
    onRemoveClick(appID) {
        console.log('onRemoveClick with appID: ' + appID);
        var url = appUrl + '/going';
        var data = {appID: appID, username: this.state.username,
            going: false, userID: this.state.userID};
        ajax.post(url, data, (err, respText) => {
            if (err) {
                this.setState({error: 'An error occurred.'});
            }
            else {
                this.log('ajax.post resp OK: ' + respText);
                // Update user info after removal
                this.getUserInfo();
            }
        });

    }

    /* Checks that user is properly authorised. */
    checkAuthorisation() {
        this.userCtrl.amIAuthorized( (err, data) => {
            if (err) {
                this.setState({error: 'Error occurred, Please refresh.'});
            }
            else {
                this.setState({
                    username: data.username,
                    userID: data.userID
                });
            }

            this.log('DEBUG: state.userID: ' + this.state.userID);
            this.getUserInfo();

        });
    }

    /** Get user info from the server.
     * @returns {undefined}
     * */
    getUserInfo() {
        var username = this.state.username;
        console.log('Retrieving userinfo with name ' + username);
        this.userCtrl.getUserProfileData(username, (err, data) => {
            if (err) {this.setState({error: 'An error occurred.'});}
            else {
                this.log('ProfileTop got data: ' + JSON.stringify(data));
                this.setState({userdata: data});
            }
        });
    }

    componentDidMount() {
        this.checkAuthorisation();
    }

	/* Adds one book for the user. */
    addBook(bookName) {
        console.log('Book ' + bookName + ' will be added.');
        this.bookCtrl.addBook(this.state.username, bookName,
            (err, resp) => {
                if (err) {this.setState({error: err});}
                else {
                    this.jsonLog('addBook response data', resp);
                    var data = this.state.userdata;
                    data.bookList.push(resp);
                    this.setState({userdata: data});
                }
        });
    }

    /* Deletes one book.*/
    deleteBook(bookData) {
        this.bookCtrl.deleteBook(bookData, (err, resp) => {
            if (err) {this.setState({error: err});}
            else {
                this.jsonLog('deleteBook response data', resp);

            }
        });

    }

    render() {
        var bookList = null;
        if (this.state.userdata) {
            bookList = (
                <ProfileBookList
                    books={this.state.userdata.bookList}
                    onClickDelete={this.deleteBook}
                />
            );
        }

        var username = this.state.username;
        return (
            <div className='profile-info'>
                <h2>Username: {username}</h2>
                {bookList}
                <AddBook onClickAdd={this.addBook}/>
            </div>
        );
    }

}

module.exports = ProfileTop;

