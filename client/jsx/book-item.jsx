
'use strict';

const React = require('react');

/* BookItem which is used in different pages to render the books.*/
class BookItem extends React.Component {

    render() {
        var book = this.props.book;
        var className = this.props.className || 'book-item';

        if (!book || !book.volumeInfo) {
            return (<div/>);
        }

        var volInfo = book.volumeInfo;

        var thumbnail = null;
        if (volInfo.imageLinks) {
            if (volInfo.imageLinks.smallThumbnail) {
                thumbnail = (
                    <img className='book-item-thumb'
                    src={volInfo.imageLinks.smallThumbnail}
                    />);
            }
        }
        if (thumbnail === null) {
            thumbnail = <p>No image available</p>;
        }

        var authorText = '';
        if (volInfo.authors) {
            if (volInfo.authors.length > 1) {
                authorText = volInfo.authors[0] + ' et al.';
            }
            else if (volInfo.authors.length === 1) {
                authorText = volInfo.authors[0];
            }
        }

        var info = (
            <ul className='book-item-ul'>
                <li>Title: {volInfo.title}</li>
                <li>Authors: {authorText}</li>
                <li>Published on: {volInfo.publishedDate}</li>
                <li>Pages: {volInfo.pageCount}</li>
            </ul>
        );

        if (this.props.hideInfo === true) {
            info = null;
        }

        return (
            <div className={className}>
                {thumbnail}
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
