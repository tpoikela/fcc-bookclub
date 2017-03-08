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
            return (<li key={index}>
                From: {item.from} <br/>
                Book: {item.book.title}
                <button onClick={callback}>Delete request</button>
            </li>
            );
        });

        return (
            <div className='prof-req-list'>
                <p>You have requested to trade the following books:</p>
                <ul>
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
