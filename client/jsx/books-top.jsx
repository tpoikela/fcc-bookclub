
'use strict';

const React = require('react');
const ajax = require('../common/ajax-functions');
const TradeCtrl = require('../ctrl/trade-ctrl');

const appUrl = window.location.origin;

class BooksTop extends React.Component {

    constructor(props) {
        super(props);
        this.requestBook = this.requestBook.bind(this);

        this.tradeCtrl = new TradeCtrl(appUrl);

        this.state = {
            books: [],
            msg: ''
        };
    }

    componentDidMount() {
        var url = appUrl + '/book';
        ajax.get(url, (err, respText) => {
            if (err) {
                this.setState({msg: err});
            }
            else {
                try {
                    var books = JSON.parse(respText);
                    this.setState({books: books});
                }
                catch (e) {
                    console.error(e + ' with respText ' + respText);
                    this.setState({msg: 'An error occurred.'});
                }
            }

        });
    }

    /* Requests the given book with a trade request.*/
    requestBook(book) {
        console.log('Book with title ' + book.title + ' requested');

    }

    render() {
        var bookList = this.state.books.map( (item, index) => {
            var onClick = this.requestBook.bind(this, item);
            var style = {color: 'red', border: '1px solid black'};
            return (
                <div key={index} style={style}>
                    <p>{item.title}</p>
                    <button onClick={onClick}>Request</button>
                </div>
            );

        });

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
