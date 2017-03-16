'use strict';

var React = require('react');

const appUrl = window.location.origin;

const UserCtrl = require('../ctrl/user-ctrl');
const BookCtrl = require('../ctrl/book-ctrl');
const TradeCtrl = require('../ctrl/trade-ctrl');

const BookList = require('./book-list');
const AddBook = require('./add-book');
const ProfileReqList = require('./prof-req-list');

const ModalViewReq = require('./modal-view-req');
const ContactInfo = require('./contact-info');

/* This component is used at the profile page of a user. It shows all books
 * added by the user, and all requests for trade.*/
class ProfileTop extends React.Component {

    constructor(props) {
        super(props);
        this.userCtrl = new UserCtrl(appUrl);
		this.bookCtrl = new BookCtrl(appUrl);
		this.tradeCtrl = new TradeCtrl(appUrl);

        this.addBook = this.addBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.searchBook = this.searchBook.bind(this);

        this.acceptTradeReq = this.acceptTradeReq.bind(this);
        this.rejectTradeReq = this.rejectTradeReq.bind(this);
        this.handleTradeReq = this.handleTradeReq.bind(this);
        this.selectTradeReq = this.selectTradeReq.bind(this);

        this.onClickShowProfile = this.onClickShowProfile.bind(this);
        this.onClickShowAddBooks = this.onClickShowAddBooks.bind(this);
        this.onClickShowContactInfo = this.onClickShowContactInfo.bind(this);

        this.onChangeContactInfo = this.onChangeContactInfo.bind(this);
        this.onClickUpdateInfo = this.onClickUpdateInfo.bind(this);

        this.selectBookForReq = this.selectBookForReq.bind(this);
        this.modalId = 'modal-view-req';

        this.state = {
            bookForReq: null,
            error: null,
            input: {},
            reqBooks: [],
            searchResults: [],
            showProfile: true,
            showAddBooks: false,
            showContactInfo: false,
            tradeReqSelected: null,
            userdata: null,
            username: null,
            userID: null
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

    onClickShowProfile() {
        this.setState({
            showProfile: true,
            showAddBooks: false,
            showContactInfo: false
        });
    }

    /* Called when tabular view switched to search/adding books.*/
    onClickShowAddBooks() {
        this.setState({
            showProfile: false,
            showAddBooks: true,
            showContactInfo: false
        });
    }

    /* Called when tabular view switched to contact info of the user.*/
    onClickShowContactInfo() {
        this.setState({
            showProfile: false,
            showAddBooks: false,
            showContactInfo: true
        });
    }

    /* TODO: Updates the user contact information.*/
    onClickUpdateInfo() {
        this.log('onClickUpdateInfo() user updated contact info');
        var info = this.state.input;
        this.userCtrl.updateContactInfo(info, (err, data) => {
            if (err) {this.error(err);}
            else {
                this.log('onClickUpdateInfo() got: ' + data);
                this.getUserInfo();
            }
        });
    }

    /* Captures the input changes from child-components and stores them.*/
    onChangeContactInfo(id, e) {
        var newValue = e.target.value;
        this.log('onChangeContactInfo id: ' + id + ' => ' + newValue);
        var input = this.state.input;
        input[id] = newValue;
        this.setState({input: input});
    }

    /* Checks that user is properly authorised. */
    checkAuthentication() {
        this.userCtrl.amIAuthenticated( (err, data) => {
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
        this.checkAuthentication();
        this.getAllBooks();
    }

    /* Retrieves a full book list from the server. */
    getAllBooks() {
        this.bookCtrl.getAllBooks( (err, books) => {
            if (err) {this.setState({msg: err});}
            else {
                this.setState({books: books});
            }
        });
    }

	/* Adds one book for the user. */
    addBook(book) {
        console.log('Book ' + book.volumeInfo.title + ' will be added.');
        var bookData = {username: this.state.username,
            book: book};
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

    /* Searches for a book to add from the server.*/
    searchBook(search) {
        this.jsonLog('searchBook sending data', search);
        this.bookCtrl.searchBook(search, (err, resp) => {
            if (err) {this.error(err);}
            else {
                var searchResults = resp.items;
                this.log('searchBook with ' + search + ' response OK');
                this.log('items.length ' + resp.items.length);
                this.setState({
                    searchResults: searchResults
                });
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
    acceptTradeReq() {
        if (this.state.tradeReqSelected !== null) {
            var tradeReq = this.state.tradeReqSelected;
            tradeReq.acceptedWith = this.state.bookForReq;
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
    rejectTradeReq() {
        var tradeReq = this.state.tradeReqSelected;
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
        this.bookCtrl.getBooksForUser(tradeReq.from, (err, data) => {
            if (err) {this.error(err);}
            else {
                console.log('selectTradeReq(): user books '
                    + JSON.stringify(data));
                this.setState({
                    reqBooks: data.books,
                    tradeReqSelected: tradeReq
                });
                console.log('selectTradeReq(): tradeReqSelected not null');
            }
        });
    }

    /* Selects the book for tradeReq (when accepted). */
    selectBookForReq(book) {
        this.setState({bookForReq: book});
    }

    render() {
        var username = this.state.username;
        var body = this.getCompBody();
        return (
            <div className='profile-info'>
                <h2>Username: {username}</h2>
                <div id='select-panel'>
                    <button onClick={this.onClickShowProfile}>
                        Profile
                    </button>
                    <button onClick={this.onClickShowAddBooks}>
                        Add books
                    </button>
                    <button onClick={this.onClickShowContactInfo}>
                        Contact details
                    </button>
                </div>
                {body}
            </div>
        );
    }

    /* Returns the rendered component body based on which button is
     * selected.*/
    getCompBody() {
        if (this.state.showProfile) {
            return this.renderProfile();
        }
        else if (this.state.showAddBooks) {
            return this.renderAddBooks();
        }
        else if (this.state.showContactInfo) {
            return this.renderContactInfo();
        }
        else {
            throw new Error('Application error.');
        }

    }


    renderProfile() {
        var bookList = null;
        var reqList = null;

        console.log('<ProfileTop> renderProfile()');

        if (this.state.userdata) {
            bookList = (
                <BookList
                    books={this.state.userdata.bookList}
                    modalId={this.modalId}
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
        return (
            <div id='profile-view'>
                {bookList}
                {reqList}

                <ModalViewReq
                    acceptReq={this.acceptTradeReq}
                    id={this.modalId}
                    rejectReq={this.rejectTradeReq}
                    reqBooks={this.state.reqBooks}
                    selectBookForReq={this.selectBookForReq}
                    tradeReq={this.state.tradeReqSelected}
                />
            </div>
        );
    }

    /* Renders the addBooks view.*/
    renderAddBooks() {
        var searchResults = this.state.searchResults;
        return (
            <div id='search-view'>
                <p>Search for books to add to your profile.</p>
                <AddBook
                    onClickAdd={this.addBook}
                    onClickSearch={this.searchBook}
                    searchResults={searchResults}
                />
            </div>
        );
    }

    /* Renders the contact info for the user.*/
    renderContactInfo() {
        return (
            <ContactInfo
                onChange={this.onChangeContactInfo}
                onClickUpdate={this.onClickUpdateInfo}
                {...this.state.userdata}
            />
        );
    }

}

module.exports = ProfileTop;

