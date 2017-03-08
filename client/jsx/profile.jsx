'use strict';

var React = require('react');

const appUrl = window.location.origin;
const ajax = require('../common/ajax-functions.js');

const UserCtrl = require('../ctrl/user-ctrl');
const BookCtrl = require('../ctrl/book-ctrl');
const TradeCtrl = require('../ctrl/trade-ctrl');

const BookList = require('./book-list');
const AddBook = require('./add-book');
const ProfileReqList = require('./prof-req-list');

const ModalViewReq = require('./modal-view-req');

/* This component is used at the profile page of a user.*/
class ProfileTop extends React.Component {

    constructor(props) {
        super(props);
        this.userCtrl = new UserCtrl(appUrl);
		this.bookCtrl = new BookCtrl(appUrl);
		this.tradeCtrl = new TradeCtrl(appUrl);

        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.addBook = this.addBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);


        this.acceptTradeReq = this.acceptTradeReq.bind(this);
        this.rejectTradeReq = this.rejectTradeReq.bind(this);
        this.handleTradeReq = this.handleTradeReq.bind(this);
        this.selectTradeReq = this.selectTradeReq.bind(this);

        this.state = {
            userdata: null,
            username: null,
            userID: null,
            error: null,
            tradeReqSelected: null
        };
    }

    error(err) {
        console.error('ProfileTop [ERROR] ' + err);
        this.setState({error: err});
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
        this.log('onRemoveClick(), appID: ' + appID);
        var url = appUrl + '/going';
        var data = {appID: appID, username: this.state.username,
            going: false, userID: this.state.userID};
        ajax.post(url, data, (err, respText) => {
            if (err) {
                this.error(err);
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
                this.error(err);
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
        this.log('getUserInfo() with name ' + username);
        this.userCtrl.getUserProfileData(username, (err, data) => {
            if (err) {this.error(err);}
            else {
                this.log('getUserInfo() got data: ' + JSON.stringify(data));
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
        var bookData = {username: this.state.username,
            title: bookName};
        this.bookCtrl.addBook(bookData, (err, resp) => {
                if (err) {this.error(err);}
                else {
                    this.jsonLog('addBook response data', resp);
                    this.getUserInfo();
                }
        });
    }

    /* Deletes one book.*/
    deleteBook(bookData) {
        this.jsonLog('deleteBook sending data', bookData);
        this.bookCtrl.deleteBook(bookData, (err, resp) => {
            if (err) {this.error(err);}
            else {
                this.jsonLog('deleteBook response data', resp);
                this.getUserInfo();
            }
        });
    }

    /* Handles the given tradeRequest. */
    handleTradeReq(tradeReq) {
        this.tradeCtrl.removeTradeReq(tradeReq, (err, resp) => {
            if (err) {this.error(err);}
            else {
                this.jsonLog('handleTradeReq() resp: ', resp);
                this.getUserInfo();
            }
        });
    }

    /* Called when user accepts a trade request with a given book.*/
    acceptTradeReq(book, tradeReq) {
        if (this.state.tradeReqSelected !== null) {
            this.tradeCtrl.acceptTradeReq(tradeReq, (err, resp) => {
                if (err) {this.error(err);}
                else {
                    this.jsonLog('rejectTradeReq() resp: ', resp);
                    this.getUserInfo();
                }
            });
        }
        else {
            this.error('No trade request selected.');
        }
    }

    /* Called when user rejects a trade request. */
    rejectTradeReq(tradeReq) {
        this.tradeCtrl.rejectTradeReq(tradeReq, (err, resp) => {
            if (err) {this.error(err);}
            else {
                this.jsonLog('rejectTradeReq() resp: ', resp);
                this.getUserInfo();
            }
        });
    }

    /* Selects the trade request to be shown by <ModalViewReq>. */
    selectTradeReq(tradeReq) {
        this.setState({tradeReqSelected: tradeReq});
    }

    render() {
        var bookList = null;
        var reqList = null;
        // var contactInfo = null;
        //

        var modalId = 'modal-view-req';

        if (this.state.userdata) {
            bookList = (
                <BookList
                    books={this.state.userdata.bookList}
                    modalId={modalId}
                    onClickDelete={this.deleteBook}
                    selectTradeReq={this.selectTradeReq}
                />
            );

            reqList = (
                <ProfileReqList
                    handleTradeReq={this.handleTradeReq}
                    reqList={this.state.userdata.tradeReqs}
                />

            );

        }

        var username = this.state.username;
        return (
            <div className='profile-info'>
                <h2>Username: {username}</h2>
                {bookList}
                <AddBook onClickAdd={this.addBook}/>
                {reqList}

                <ModalViewReq
                    acceptReq={this.acceptTradeReq}
                    id={modalId}
                    rejectReq={this.rejectTradeReq}
                    tradeReq={this.state.tradeReqSelected}
                />
            </div>
        );
    }

}

module.exports = ProfileTop;

