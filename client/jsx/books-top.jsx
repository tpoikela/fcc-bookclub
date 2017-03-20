
'use strict';

const React = require('react');

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

        this.tradeCtrl = new TradeCtrl(appUrl);
        this.bookCtrl = new BookCtrl(appUrl);

        this.state = {
            books: [],
            msg: '',
            booksPerPage: 20
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
        var msg = (<p>{this.state.msg}</p>);

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
        if (this.state.books.length > 0) {
            bookList = this.state.books.map( (book, index) => {
                var onClick = this.requestBook.bind(this, book);
                return (
                    <div className='books-book-item' key={index}>

                        <BookItem book={book} />

                        <button className='books-req-btn'
                            onClick={onClick}
                            >
                            Request
                        </button>

                    </div>
                );

            });
        }
        return bookList;

    }

}

module.exports = BooksTop;
