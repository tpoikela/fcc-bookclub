'use strict';

const TradeCtrl = require('../server/ctrl/trade-ctrl.server');
const User = require('../server/model/user-schema');
const chai = require('chai');
const Utils = require('./test-utils');

const expect = chai.expect;

Utils.connectTestDb();

describe('Server-side TradeController', function() {

    var tradeCtrl = null;

    beforeEach( (done) => {
        tradeCtrl = new TradeCtrl();
        User.remove({}, err => {
            if (err) {throw new Error(err);}
            else {
                done();
            }
        });
    });

    afterEach( () => {
        tradeCtrl = null;
    });

    it('Adds a trade request for the user', function(done) {
        var user = Utils.createUser('xxx');
        user.save( err => {
            if (err) {throw new Error(err);}
            else {
                var reqBody = {
                    book: Utils.createBook('Bible')
                };
                reqBody.book._id = Utils.getObjectId();
                tradeCtrl.addTradeReq(user.username, reqBody, err => {
                    if (err) {console.error(err);}
                    expect(err).to.be.null;
                    User.findOne({username: 'xxx'}, (err, data) => {
                        if (err) {throw new Error(err);}
                        else {
                            expect(data.tradeReqs).to.be.length(1);
                            done();
                        }
                    });
                });
            }
        });

    });

    it('Removes a tradeRequest from a user', function() {

    });

    it('Modifies tradeReq state if req accepted', function(done) {
        var fromUsername = 'abcdefg';
        var toUsername = 'userRequestedFrom';
        var fromUser = Utils.createUser(fromUsername);
        var toUser = Utils.createUser(toUsername);

        var tradeReq = Utils.createTradeReq();
        tradeReq.from = fromUsername;

        Utils.saveUsers([fromUser, toUser], () => {
            var reqBody = {
                acceptedWith: Utils.createBook('Bible'),
                tradeReq: tradeReq
            };
            tradeCtrl.acceptTradeReq(toUsername, reqBody, (err, data) => {
                if (err) {throw new Error(err);}
                else {
                    expect(data.nModified).to.equal(1);
                    done();
                }

            });

        });

    });

    it('Modifies tradeReq state if req reject', function() {

    });

});
