'use strict';

const React = require('react');
const ProfileBookItem = require('./prof-book-item');

class BookList extends React.Component {


    render() {
        var modalId = this.props.modalId;
        var books = this.props.books;
        var bookList = null;
        var onClickDelete = this.props.onClickDelete;
        var selectTradeReq = this.props.selectTradeReq;

        bookList = books.map( (book, index) => {
            return (
                <ProfileBookItem
                    book={book}
                    key={index}
                    modalId={modalId}
                    onClickDelete={onClickDelete}
                    selectTradeReq={selectTradeReq}
                />
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
    books: React.PropTypes.array,
    modalId: React.PropTypes.string,
    onClickDelete: React.PropTypes.func,
    selectTradeReq: React.PropTypes.func
};

module.exports = BookList;
