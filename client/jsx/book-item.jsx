
'use strict';

const React = require('react');

class BookItem extends React.Component {

    render() {
        var book = this.props.book;
        return (
            <div className='book-item'>
                <ul>
                    <li>Title: {book.title}</li>
                </ul>
            </div>
        );
    }
}

BookItem.propTypes = {
    book: React.PropTypes.object
};

module.exports = BookItem;
