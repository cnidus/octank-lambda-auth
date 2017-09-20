'use strict';

var fs = require('fs');

var chai = require('chai');
var assert = chai.assert;
var sinon = require('sinon');

var request = require('request');

var refresh = require('../auth/refresh');

var event = require('../event.json');
var good_google_response = require('./good_google_response.json');

var gResponse;

this.sandbox = '';

describe('refresh by hitting  google server', function () {
    beforeEach(function (done) {
        refresh(event, {}, function (error, response) {
            gResponse = response;
            done();
        })
    })
    it('should get new token given a refresh_token', function () {
        assert.isDefined(JSON.parse(gResponse.body).id_token, "Got the new token");
    })
});

describe('refresh using mock google response', function () {
    beforeEach(function () {
        this.sandbox = sinon.sandbox.create();
    })
    afterEach(function () {
        this.sandbox.restore();
    })
    it('should get new token given a refresh_token', function () {
        this.sandbox.stub(request, 'post').callsFake(function (options, cb) {
            var error = null;
            var response = good_google_response;
            var body = good_google_response.body

            cb(error, response, body);
        })

        refresh(event, {}, function (error, response) {
            assert.isDefined(response.body.id_token, "Got the new token");
        })

    })
})