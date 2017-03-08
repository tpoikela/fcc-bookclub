
'use strict';

const React = require('react');

class BookItem extends React.Component {

    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickReject = this.onClickReject.bind(this);
        this.onClickView = this.onClickView.bind(this);
    }

    onClickDelete() {
        this.props.onClickDelete(this.props.book);
    }

    onClickAccept() {

    }

    onClickReject() {

    }

    onClickView() {

    }

    render() {
        var book = this.props.book;
        var tradeReqs = book.tradeReqs;
        var reqElem = null;
        var modalId = '#' + this.props.modalId;

        reqElem = tradeReqs.map( (item, index) => {
            return (
                <div key={index}>
                    Request on {item.createdOn}.<br/>

                    <button
                        className='btn btn-secondary btn-warning'
                        data-target={modalId}
                        data-toggle='modal'
                        type='button'
                        >
                        View Request
                    </button>

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
    modalId: React.PropTypes.string,
    onClickDelete: React.PropTypes.func
};

module.exports = BookItem;
