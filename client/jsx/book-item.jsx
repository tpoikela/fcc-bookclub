
'use strict';

const React = require('react');

/* BookItem which is used in different pages to render the books.*/
class BookItem extends React.Component {

    render() {
        var book = this.props.book;
        var className = this.props.className || 'book-item';

        var volInfo = book.volumeInfo;

        var thumbnail = null;
        if (volInfo.imageLinks) {
            if (volInfo.imageLinks.smallThumbnail) {
                thumbnail = (
                    <img className='img-responsive book-item-thumb'
                    src={volInfo.imageLinks.smallThumbnail}
                    />);
            }
        }

        var authorText = '';
        if (volInfo.authors.length > 1) {
            authorText = volInfo.authors[0] + ' et al.';
        }
        else if (volInfo.authors.length === 1) {
            authorText = volInfo.authors[0];
        }

        var info = (
            <li className='book-item-li'>
                <ul>
                    <li>Title: {volInfo.title}</li>
                    <li>Authors: {authorText}</li>
                    <li>Published on: {volInfo.publishedDate}</li>
                    <li>Pages: {volInfo.pageCount}</li>
                </ul>
            </li>
        );

        if (this.props.hideInfo) {
            info = null;
        }

        return (
            <div className={className}>
                <ul className='book-item-ul'>
                    <li className='book-item-li'>{thumbnail}</li>
                </ul>
                {info}
            </div>
        );

    }
}

BookItem.propTypes = {
    book: React.PropTypes.object,
    className: React.PropTypes.string,
    hideInfo: React.PropTypes.bool
};

module.exports = BookItem;
