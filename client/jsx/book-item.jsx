
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
                thumbnail = <img src={volInfo.imageLinks.smallThumbnail}/>;
            }
        }

        return (
            <div className={className}>
                <ul className='book-item-ul'>
                    <li className='book-item-li'>{thumbnail}</li>
                    <li className='book-item-li'>
                        <ul>
                            <li>Title: {volInfo.title}</li>
                            <li>Year: {volInfo.publishedData}</li>
                            <li>Pages: {volInfo.pageCount}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        );

    }
}

BookItem.propTypes = {
    book: React.PropTypes.object,
    className: React.PropTypes.string
};

module.exports = BookItem;
