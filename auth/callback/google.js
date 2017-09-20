'use strict';

var config = require('../config');
const querystring = require('querystring');
var request = require('request');


module.exports.callback = (event, context, callback) => {
    var provider = event.pathParameters.provider;
    var stage = event.requestContext.stage;
    var app_url = config.stage[stage].application_url;
    var redirect_url = config.stage[stage].redirect_url;

    const res = {
        statusCode: 302, //redirect to application auth url,
        headers: {
            'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
            location: app_url + '/auth/' + provider + '?'
        }
    };

    var data = {
        redirect_uri: redirect_url + '/' + stage + '/auth/callback/' + provider,
        grant_type: 'authorization_code',
        code: event.queryStringParameters.code,
        client_secret: config.google.client_secret,
        client_id: config.google.client_id,
    };

    console.log('inside callback: ', data);

    request.post({
        uri: config.google.token_url,
        formData: data
    }, (error, response, body) => {
        res.headers.location += querystring.stringify(JSON.parse(body))
        callback(null, res);   //redirect to front end application
    });
}