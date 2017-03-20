
'use strict';

const React = require('react');
const ModalHeader = require('./modal-header');
const BookItem = require('./book-item');


/* This modal view is shown when the user checks a certain request. */
class ModalViewReq extends React.Component {

    constructor(props) {
        super(props);

        this.acceptReq = this.acceptReq.bind(this);
        this.rejectReq = this.rejectReq.bind(this);
        this.selectBookForReq = this.selectBookForReq.bind(this);
    }

    acceptReq() {
        this.props.acceptReq();
    }

    rejectReq() {
        this.props.rejectReq();
    }

    /* Selects which book is chosen for the tradeReq.*/
    selectBookForReq(book) {
        this.props.selectBookForReq(book);
    }

    render() {
        var modalId = this.props.id;
        var titleText = 'View trade request';
        var reqBooks = this.props.reqBooks;
        var tradeReq = this.props.tradeReq;
        var bookForReq = this.props.bookForReq;

        var bookList = reqBooks.map( (item, index) => {
            var selectBook = this.selectBookForReq.bind(this, item);
            console.log('Item is ' + JSON.stringify(item));
            return (
                <div key={index}>
                    <BookItem book={item} />
                    <button onClick={selectBook}>Select</button>
                </div>
            );
        });

        // When modal not shown, tradeReq not defined for the 1st time
        var reqFrom = '';
        var acceptedStatus = null;
        if (tradeReq !== null) {
            reqFrom = tradeReq.from;

            if (tradeReq.acceptedWith) {
                acceptedStatus = (
                    <p className='text-success'>
                        You've accepted this request.
                    </p>
                );
            }
            else if (tradeReq.state === 'Rejected') {
                acceptedStatus = (
                    <p className='text-danger'>
                        You've rejected this request.
                    </p>
                );
            }
        }

        var selectedBook = null;
        if (bookForReq) {
            var selTitle = bookForReq.title;
            selectedBook = <p>Selected: {selTitle}</p>;
        }


        return (
            <div
                aria-hidden='true'
                aria-labelledby='view-req-modal-label'
                className='modal fade'
                id={modalId}
                role='dialog'
                tabIndex='-1'
                >

                <div className='modal-dialog modal-lg'>
                    <div className='modal-content'>

                        <ModalHeader
                            id='view-req-modal-label'
                            text={titleText}
                        />

                        <div className='modal-body row'>
                            <p>You've received a request from {reqFrom}.</p>
                            <p>
                                You can choose
                                one of the following books and click Accept,
                                or you can reject the trade by clicking Reject.
                            </p>
                            <hr/>
                            <p>You can pick one of the following books:</p>
                            {bookList}
                            {selectedBook}
                            <hr/>
                            {acceptedStatus}
                        </div>

                        <div className='modal-footer row'>
                            <div className='col-md-6'>

                                <button
                                    className='btn btn-secondary btn-success'
                                    onClick={this.acceptReq}
                                    type='button'
                                    >
                                    Accept
                                </button>

                                <button
                                    className='btn btn-secondary btn-danger'
                                    onClick={this.rejectReq}
                                    type='button'
                                    >
                                    Reject
                                </button>

                                <button
                                    className='btn btn-secondary'
                                    data-dismiss='modal'
                                    type='button'
                                    >
                                    Close
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

ModalViewReq.propTypes = {
    bookForReq: React.PropTypes.object,
    id: React.PropTypes.string,
    tradeReq: React.PropTypes.object,
    acceptReq: React.PropTypes.func,
    rejectReq: React.PropTypes.func,
    reqBooks: React.PropTypes.array,
    selectBookForReq: React.PropTypes.func
};

module.exports = ModalViewReq;

