'use strict';

const React = require('react');
const BookItem = require('./book-item');

class BookList extends React.Component {

    render() {
        var books = this.props.books;
        var bookList = null;

        bookList = books.map( (item, index) => {
            return (
                <BookItem book={item} key={index} />
            );
        });

        return (
            <div className='book-list'>
                {bookList}
            </div>
        );
    }

}

BookList.propTypes = {
    books: React.PropTypes.array
};

module.exports = BookList;
