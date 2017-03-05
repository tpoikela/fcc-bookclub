'use strict';

const ajax = require('../common/ajax-functions');

/* Controller handling all operations related to the book trading on
 * client-side.*/
class TradeCtrl {

    constructor(url) {
        this.appUrl = url;
    }

    /* Makes a trade request to the given book. */
    makeTradeReq(username, book, cb) {
        var url = this.appUrl + '/tradereq';
        var postData = {book: book};

        ajax.post(url, postData, (err, respText) => {
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
        });

    }

    /* Removes a trade request made by the same user .*/
    removeTradeReq() {

    }

    /* Sends accept trade request to the server. */
    acceptTradeReq() {

    }

    /* Sends reject trade request to the server. Essentially, a remove by
     * another user than the creator of request. */
    rejectTradeReq() {

    }

}

module.exports = TradeCtrl;
