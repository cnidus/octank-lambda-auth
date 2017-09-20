'use strict';

var google = require('./signin/google');
var facebook = require('./signin/facebook');

module.exports = (event, context, callback) => {
    var signInMethod;
    
    if (event.pathParameters.provider === "google") {
        google.signin(event, context, callback);
    } else if (event.pathParameters.provider === "facebook") {
        facebook.signin(event, context, callback);
    } else {
        const response = {
            statusCode: 200,
            headers: {
                'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
            },
            body: JSON.stringify({
            message: 'Provider not supported. Found no pathParameters in signin.js',
            event: event,
            context : context
            }),
        };

        callback(null, response);
    }
  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
