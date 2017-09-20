'use strict';

var google = require("./validate/google");
var facebook = require("./validate/facebook");
    
module.exports = (event, context, callback) => {
    // build apiOptions for the AuthPolicy
    const apiOptions = {};
    const tmp = event.methodArn.split(':');
    const apiGatewayArnTmp = tmp[5].split('/', 3);
    const awsAccountId = tmp[4];
    apiOptions.region = tmp[3];
    apiOptions.restApiId = apiGatewayArnTmp[0];
    apiOptions.stage = apiGatewayArnTmp[1];
    apiOptions.method = apiGatewayArnTmp[2];
    apiOptions.requestedResource = apiGatewayArnTmp[3];
    console.log('apiOptions: ', apiOptions);

    // validate the incoming token
    // and produce the principal user identifier associated with the token

    //decode base64 encode string
    var bToken = event.authorizationToken.split(' ')[1];
    //console.log("Authorization header is: ", event.authorizationToken);
    console.log('bToken: ', bToken);
    var buffer = new Buffer(bToken, 'base64');
    var bufferString = buffer.toString();
    console.log('bufferString: ', bufferString)
    var decodedToken = JSON.parse(bufferString);

    if (decodedToken['google']) {
        console.log('google token found');
        google.validate(decodedToken.google.id_token, function (error, result) {
            var options = {
                error: error,
                result: result,
                awsAccountId: awsAccountId,
                apiOptions: apiOptions,
                token: decodedToken.google.id_token
            };
            google.getPolicy(options, function (err, policy) {
                callback(err, policy);
            });
        }); 
    } else if (decodedToken['facebook']) {
        console.log('facebook token found. Will validate token now.');
        facebook.validate(decodedToken.facebook.access_token, function (error, result) {
            console.log('facebook validate token result is: ', result);
            var options = {
                error: error,
                result: result,
                awsAccountId: awsAccountId,
                apiOptions: apiOptions,
                token: decodedToken.facebook.access_token
            };
            facebook.getPolicy(options, function (err, policy) {
                callback(err, policy);
            });
        }); 
    }    
};
