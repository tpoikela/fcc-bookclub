'use strict';

var React = require('react');

/* This component is used at the profile page of a user.*/
class ProfileReqList extends React.Component {

    constructor(props) {
        super(props);
        this.handleTradeReq = this.handleTradeReq.bind(this);
    }

    handleTradeReq(reqItem) {
        this.props.handleTradeReq(reqItem);
    }

    render() {
        var reqList = this.props.reqList;
        var reqElems = null;

        reqElems = reqList.map( (item, index) => {
            var callback = this.handleTradeReq.bind(this, item);
            return (<li className='prof-req-list-li' key={index}>
                From: {item.from} <br/>
                Book: {item.book.title}
                Status: {item.state}
                <button onClick={callback}>Delete request</button>
            </li>
            );
        });

        var requestMsg = <p>You haven't done any trade requests yet.</p>;
        if (reqList.length > 0) {
            requestMsg = (
                <p>You have requested to trade the following books:</p>);
        }

        return (
            <div className='prof-req-list-div'>
                <h2>Your requests</h2>
                {requestMsg}
                <ul className='prof-req-list-ul'>
                {reqElems}
                </ul>
            </div>

        );

    }

}

ProfileReqList.propTypes = {
    handleTradeReq: React.PropTypes.func,
    reqList: React.PropTypes.array
};

module.exports = ProfileReqList;
