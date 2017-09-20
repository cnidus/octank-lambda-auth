'use strict';

var config = require('../config');
const querystring = require('querystring');
var request = require('request');


module.exports.callback = (event, context, callback) => {
    var stage = event.requestContext.stage;
    var provider = event.pathParameters.provider;
    var app_url = config.stage[stage].application_url;
    var redirect_url = config.stage[stage].redirect_url;

    const res = {
        statusCode: 302, //redirect to front end application auth url,
        headers: {
            'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
            location: app_url + '/auth/' + provider + '?'
        }
    };

    console.log('res is: ', res);
    console.log('stage is: ', stage);
    console.log('event is: ', event);

    var data = {
        redirect_uri: redirect_url + '/' + stage + '/auth/callback/' + provider,
        code: event.queryStringParameters.code,
        client_secret: config.facebook.client_secret,
        client_id: config.facebook.client_id,
    };

    console.log('data is: ', data);

    request.post({
        uri: config.facebook.token_url,
        formData: data
    }, (error, response, body) => {
        res.headers.location += querystring.stringify(JSON.parse(body))
        callback(null, res);   //redirect to front end application
    });

    
}