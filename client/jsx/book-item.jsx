
'use strict';

const React = require('react');

class BookItem extends React.Component {

    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
    }

    onClickDelete() {
        this.props.onClickDelete(this.props.book);
    }

    render() {
        var book = this.props.book;
        return (
            <div className='book-item'>
                <ul>
                    <li>
                        Title: {book.title}
                        <button onClick={this.onClickDelete}>X</button>
                    </li>
                </ul>
            </div>
        );
    }
}

BookItem.propTypes = {
    book: React.PropTypes.object,
    onClickDelete: React.PropTypes.func
};

module.exports = BookItem;
