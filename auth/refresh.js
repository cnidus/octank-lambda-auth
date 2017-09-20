'use strict';

var config = require('./config');
var request = require('request');
const querystring = require('querystring');

module.exports = (event, context, callback) => {

    var res = {
        statusCode: 200, //redirect to application auth url,
        headers: {
            'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
            'Access-Control-Allow-Origin': '*' //Need to set this manually. API Gateway does not do it
        },
        body: {}
    };
    var refresh_token = querystring.unescape(event.pathParameters.refresh_token);

    var formdata = {
        "refresh_token": refresh_token,
        "client_id": config.google.client_id,
        "client_secret": config.google.client_secret,
        "grant_type": "refresh_token"
    };

    request.post({
        uri: config.google.refresh_token_url,
        form: formdata
    }, (error, response, body) => {
        res.body = body;
        callback(null, res);
    });
};
