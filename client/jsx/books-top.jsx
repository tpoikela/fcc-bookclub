
'use strict';

const React = require('react');

const UserCtrl = require('../ctrl/user-ctrl');

const TradeCtrl = require('../ctrl/trade-ctrl');
const BookCtrl = require('../ctrl/book-ctrl');
const BookItem = require('./book-item');

const appUrl = window.location.origin;

/* Top-level component for /allbooks view. This is a list of all books added by
 * all users. */
class BooksTop extends React.Component {

    constructor(props) {
        super(props);
        this.requestBook = this.requestBook.bind(this);

        this.userCtrl = new UserCtrl(appUrl);
        this.tradeCtrl = new TradeCtrl(appUrl);
        this.bookCtrl = new BookCtrl(appUrl);

        this.state = {
            books: [],
            msg: '',
            booksPerPage: 20,
            userID: null,
            userdata: null,
            username: null
        };

        this.debugEnabled = false;
    }

    /* For printing debug information. */
    debug(msg) {
        if (this.debugEnabled) {
            console.log('BooksTop [DEBUG] ' + msg);
        }
    }

    componentDidMount() {
        this.userCtrl.checkAuthentication(this);
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

    /* Requests the given book with a trade request. Works only for
     * authenticated users. */
    requestBook(book) {
        this.debug('Book with title ' + book.title + ' requested');
        this.tradeCtrl.makeTradeReq(book, (err, data) => {
            if (err) {
                this.setState({msg: err});
            }
            else {
                this.debug('requestBook OK response: ' + JSON.stringify(data));
                this.setState({msg: 'Your trade request was submitted.'});
            }
        });
    }

    render() {
        var bookList = this.getBookListRendered();
        var msg = this.getMessage();

        return (
            <div className='books-top'>
                {msg}
                <div className='book-list-flex'>
                    {bookList}
                </div>
            </div>

        );
    }

    getBookListRendered() {
        var bookList = null;

        var userHasBooks = false;
        if (this.state.userdata) {
            userHasBooks = this.state.userdata.bookList.length > 0;
        }

        if (this.state.books.length > 0) {
            bookList = this.state.books.map( (book, index) => {

                var reqButton = null;
                var btnClass = 'books-btn';
                var onClick = this.requestBook.bind(this, book);

                if (!userHasBooks) {
                    btnClass += ' btn-disabled';
                    onClick = this.error.bind(this,
                        "You don't have any books to trade!");
                }

                if (this.state.username) {
                    reqButton = (
                        <button className={btnClass}
                            onClick={onClick}
                            >
                            Request
                        </button>
                    );
                }
                return (
                    <div className='books-book-item' key={index}>

                        <BookItem
                            book={book}
                            hideInfo={true}
                        />
                        {reqButton}
                    </div>
                );

            });
        }
        return bookList;
    }

    error(msg) {
        this.setState({msg: msg});
    }

    getMessage() {
        var userdata = this.state.userdata;
        var msg = [<p key={0}>{this.state.msg}</p>];
        if (userdata) {
            var info = null;
            if (userdata.bookList.length === 0) {
                info = (
                <p key={1}>
                    You haven't added any books to your profile yet. You cannot
                    make trade requests before adding some books to your
                    profile.
                </p>
                );
            }
            else {
                info = (
                <p key={1}>
                    You can request books for trade by clicking 'Request'. You
                    can iew the request you have done from your profile.
                </p>
                );
            }
            msg.push(info);
        }

        return msg;
    }

}

module.exports = BooksTop;
