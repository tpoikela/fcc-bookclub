
'use strict';

const React = require('react');

class BookItem extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.book);
    }

    render() {
        var book = this.props.book;
        return (
            <div className='book-item'>
                <ul>
                    <li>
                        Title: {book.title}
                        <button onClick={this.onClick}>X</button>
                    </li>
                </ul>
            </div>
        );
    }
}

BookItem.propTypes = {
    book: React.PropTypes.object,
    onClick: React.PropTypes.func
};

module.exports = BookItem;
