'use strict';

const ajax = require('../common/ajax-functions');

/* Controller handling all operations related to the book trading on
 * client-side.*/
class TradeCtrl {

    constructor(url) {
        this.appUrl = url;
    }

    /* Handles error in ajax, parsing the response and passing args to the
     * callback. */
    _processAjaxResp(err, respText, cb) {
        if (err) {cb(err);}
        else {
            try {
                var respObj = JSON.parse(respText);
                cb(null, respObj);
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    /* Makes a trade request to the given book. */
    makeTradeReq(book, cb) {
        var url = this.appUrl + '/tradereq';
        var postData = {book: book};

        ajax.post(url, postData, (err, respText) => {
            this._processAjaxResp(err, respText, cb);
        });

    }

    /* Removes a trade request made by the same user .*/
    removeTradeReq(tradeReq, cb) {
        var url = this.appUrl + '/tradereq';
        var postData = {tradeReq: tradeReq};
        ajax.delete(url, postData, (err, respText) => {
            this._processAjaxResp(err, respText, cb);
        });
    }

    /* Sends accept trade request to the server. */
    acceptTradeReq(tradeReq, book, cb) {
        var url = this.appUrl + '/tradereq/accept';
        var postData = {book: book, tradeReq: tradeReq};
        ajax.post(url, postData, (err, respText) => {
            this._processAjaxResp(err, respText, cb);
        });
    }

    /* Sends reject trade request to the server. Essentially, a remove by
     * another user than the creator of request. */
    rejectTradeReq(tradeReq, cb) {
        var url = this.appUrl + '/tradereq/reject';
        var postData = {tradeReq: tradeReq};
        ajax.post(url, postData, (err, respText) => {
            this._processAjaxResp(err, respText, cb);
        });
    }

}

module.exports = TradeCtrl;
