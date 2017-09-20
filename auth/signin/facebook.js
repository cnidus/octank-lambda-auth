'use strict';

var config = require('../config');
const querystring = require('querystring');


module.exports.signin = (event, context, callback) => {
    var provider = event.pathParameters.provider;
    var stage = event.requestContext.stage;
    var host = config.stage[stage].redirect_url;
    const res = {
        statusCode: 302, //redirect to google auth url
    };

    var qs = {
        redirect_uri: host + '/' + stage + '/auth/callback/' + provider,
        response_type: 'code',
        client_id: config.facebook.client_id,
        scope: config.facebook.scope
    };

    var signinUri = config.facebook.oauth_url + '?' + querystring.stringify(qs);

    res.headers = {
        'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
        Location: signinUri
    };

    callback(null, res);   
}