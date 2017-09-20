'use strict';

var google = require('./callback/google');
var facebook = require('./callback/facebook');

module.exports = (event, context, callback) => {
    console.log('pathParameters: ', event.pathParameters)
    
    if (event.pathParameters.provider === "google") {
        console.log('Found pathparameter google');
        google.callback(event, context, callback);
    } else if (event.pathParameters.provider === "facebook") {
        console.log('Found pathparameter facebook');
        facebook.callback(event, context, callback);
    } else {
        console.log('Found no pathparameter');
        const response = {
            statusCode: 200,
            headers: {
                'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            body: JSON.stringify({
            message: 'Provider not supported. Found no pathParameters google or facebook',
            event: event,
            context : context
            }),
        };

        callback(null, response);
    }
  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
