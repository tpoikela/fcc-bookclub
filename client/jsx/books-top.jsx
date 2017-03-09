
'use strict';

const React = require('react');

const TradeCtrl = require('../ctrl/trade-ctrl');
const BookCtrl = require('../ctrl/book-ctrl');

const appUrl = window.location.origin;

class BooksTop extends React.Component {

    constructor(props) {
        super(props);
        this.requestBook = this.requestBook.bind(this);

        this.tradeCtrl = new TradeCtrl(appUrl);
        this.bookCtrl = new BookCtrl(appUrl);

        this.state = {
            books: [],
            msg: ''
        };
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

    /* Requests the given book with a trade request.*/
    requestBook(book) {
        console.log('Book with title ' + book.title + ' requested');
        this.tradeCtrl.makeTradeReq(book, (err, data) => {
            if (err) {
                this.setState({msg: err});
            }
            else {
                console.log('requestBook OK response: ' + JSON.stringify(data));
                this.setState({msg: 'Your trade request was submitted.'});
            }
        });
    }

    render() {
        var bookList = null;
        if (this.state.books.length > 0) {
            bookList = this.state.books.map( (item, index) => {
                var onClick = this.requestBook.bind(this, item);
                var style = {color: 'red', border: '1px solid black'};
                return (
                    <div key={index} style={style}>
                        <p>{item.title}</p>
                        <button onClick={onClick}>Request</button>
                    </div>
                );

            });
        }

        var msg = (<p>{this.state.msg}</p>);

        return (
            <div className='books-top'>
                {msg}
                {bookList}
            </div>

        );
    }

}

module.exports = BooksTop;
