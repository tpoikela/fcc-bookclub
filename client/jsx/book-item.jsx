
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

    onClickAccept() {

    }

    onClickReject() {

    }

    render() {
        var book = this.props.book;
        var tradeReqs = book.tradeReqs;
        var reqElem = null;

        reqElem = tradeReqs.map( (item, index) => {
            return (
                <div key={index}>
                    Request on {item.createdOn}.<br/>
                    <button>View Request</button>
                    <button>Accept</button>
                    <button>Reject</button>
                </div>
            );
        });


        return (
            <div className='book-item'>
                <ul>
                    <li>
                        Title: {book.title}
                        <button onClick={this.onClickDelete}>X</button>
                        {reqElem}
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
