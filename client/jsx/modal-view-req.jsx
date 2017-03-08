
'use strict';

const React = require('react');
const ModalHeader = require('./modal-header');

/* This modal view is shown when the user checks a certain request. */
class ModalViewReq extends React.Component {

    constructor(props) {
        super(props);

        this.acceptReq = this.acceptReq.bind(this);
        this.rejectReq = this.rejectReq.bind(this);
    }


    acceptReq() {
        this.props.acceptReq();
    }

    rejectReq() {
        this.props.rejectReq();
    }

    render() {
        var modalId = this.props.id;
        var titleText = 'View trade request';
        // var tradeReq = this.props.tradeReq;

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
                            <p>BODY XXXXXXXXXXXXXXXX</p>
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

                                <button data-dismiss='modal' type='button'>
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
    rejectReq: React.PropTypes.func
};

module.exports = ModalViewReq;

