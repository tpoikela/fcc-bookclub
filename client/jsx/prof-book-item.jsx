'use strict';

const React = require('react');

class ProfileBookItem extends React.Component {

    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickAccept = this.onClickAccept.bind(this);
        this.onClickReject = this.onClickReject.bind(this);
        this.onClickView = this.onClickView.bind(this);
        this.selectTradeReq = this.selectTradeReq.bind(this);
    }

    onClickDelete() {
        this.props.onClickDelete(this.props.book);
    }

    selectTradeReq(tradeReq) {
        this.props.selectTradeReq(tradeReq);
    }

    render() {
        var book = this.props.book;
        var tradeReqs = book.tradeReqs;
        var reqElem = null;
        var modalId = '#' + this.props.modalId;

        reqElem = tradeReqs.map( (tradeReq, index) => {
            var selectTradeReq = this.selectTradeReq.bind(this, tradeReq);
            return (
                <div key={index}>
                    Request on {tradeReq.createdOn}.<br/>

                    <button
                        className='btn btn-secondary btn-warning'
                        data-target={modalId}
                        data-toggle='modal'
                        onClick={selectTradeReq}
                        type='button'
                        >
                        View Request
                    </button>
                </div>
            );
        });


        return (
            <div className='book-item'>
                <ul>
                    <li>
                        Title: {book.title}
                        <button onClick={this.onClickDelete}>
                            Delete book
                        </button>
                        {reqElem}
                    </li>
                </ul>
            </div>
        );
    }
}

ProfileBookItem.propTypes = {
    book: React.PropTypes.object,
    modalId: React.PropTypes.string,
    onClickDelete: React.PropTypes.func,
    selectTradeReq: React.PropTypes.func
};

module.exports = ProfileBookItem;
