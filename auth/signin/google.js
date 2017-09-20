'use strict';

var config = require('../config');
const querystring = require('querystring');


module.exports.signin = (event, context, callback) => {
    var provider = event.pathParameters.provider;
    var stage = event.requestContext.stage;
    var host = config.stage[stage].redirect_url;
    var scope = config.google.scope ;
    var oauthUrl = config.google.oauth_url ;

    const res = {
        statusCode: 302, //redirect to google auth url
    };

    var qs = {
        redirect_uri: host + '/' + stage + '/auth/callback/' + provider,
        prompt: 'consent',
        response_type: 'code',
        client_id: config.google.client_id,
        scope: scope,
        access_type: 'offline'
    };
    

    var googleUri = oauthUrl + '?' + querystring.stringify(qs);

    console.log('inside signin: ', googleUri);

    res.headers = {
        'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
        Location: googleUri
    };

    callback(null, res);   
}