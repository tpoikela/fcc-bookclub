
'use strict';

const React = require('react');
const ModalHeader = require('./modal-header');

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

    shouldComponentUpdate() {
        if (this.props.tradeReq !== null) {return true;}
        return false;
    }


    render() {
        var modalId = this.props.id;
        var titleText = 'View trade request';
        var reqBooks = this.props.reqBooks;
        var tradeReq = this.props.tradeReq;

        var bookList = reqBooks.map( (item, index) => {
            var selectBook = this.selectBookForReq.bind(this, item);
            return (
                <div key={index}>
                    {item.title}
                    <button onClick={selectBook}>Select</button>
                </div>
            );
        });

        if (tradeReq === null) {return <div/>;}

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
                            <p>You've received a trade request. You can choose
                                one of the following books and click Accept,
                                or you can reject the trade by clicking Reject.
                            </p>
                            <p>Request from: {tradeReq.from}</p>
                            <p>You can pick one of the following books:</p>
                            {bookList}
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
    id: React.PropTypes.string,
    tradeReq: React.PropTypes.object,
    acceptReq: React.PropTypes.func,
    rejectReq: React.PropTypes.func,
    reqBooks: React.PropTypes.array,
    selectBookForReq: React.PropTypes.func
};

module.exports = ModalViewReq;

