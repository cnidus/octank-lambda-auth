'use strict';

var request = require("request");
var config = require("../config");
var AuthPolicy = require("./authpolicy");
/**
 * Validates a facebook access token
 * Documentation @ https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#checktoken
 *
 * @return - invalid, success
 *
 */
//module.exports = function (token, callback) {
module.exports.validate = function (token, callback) {
    var url = config.facebook.token_info_url + token + '&access_token=' +
        config.facebook.client_id + '|' + config.facebook.client_secret;

    request.get(url, function (error, response, body) {
        /**
         *body looks like:
        {
        data: {
            app_id: "1714732625512458",
            application: "CloudApp - Test1",
            expires_at: 1483746147,
            is_valid: true,
            issued_at: 1478562147,
            scopes: [
            "email",
            "public_profile"
            ],
            user_id: "10154741578589365"
        }
        }
        */
        if (error) {
            callback(null, "error")
        } else {
            console.log('validate response is: ', body);
            var b = JSON.parse(body).data;

            if (b.error) {
                callback(new Error(b.error.message));
            } else if (b.app_id === config.facebook.client_id && b.is_valid === true) {
                //validate that token is from our app and is valid
                callback(null, b);
            } else {
                callback(new Error("Facebook returned unknown error"));
            }
        }
    });
}

module.exports.getPolicy = function (options, callback) {
    if (!options.error) {
        var url = config.facebook.graph_endpoint + options.token;
        request.get(url, function (e, response, body) {    //get email from endpoint
            if (!e) {
                const principalId = JSON.parse(body).email;
                const policy = new AuthPolicy(principalId, options.awsAccountId, options.apiOptions);

                // options.apiOptions.requestedResource - will fine tune it later. This is good enough for now
                //policy.allowMethod(options.apiOptions.method, "/*"); //Resource is the URL to give access to. * is to give access to all
                policy.allowMethod("*", "/*");  //Allowing access for all the methods to enable auth result caching by APIG

                // finally, build the policy and exit the function
                callback(null, policy.build());
            } else {
                callback(e);
            }
        });
    } else {
        console.log("Authentication error is: ", options.error);
        // if access is denied, the client will recieve a 403 Access Denied response
        const principalId = 'unAuthorizedUser';
        const policy = new AuthPolicy(principalId, options.awsAccountId, options.apiOptions);

        //const policy = new AuthPolicy(principalId, awsAccountId, apiOptions);
        // the example policy below denies access to all resources in the RestApi
        policy.denyAllMethods();
        console.log("Unauthorize Policy sent is: ", JSON.stringify(policy.build()));
        callback(null, policy.build());
    }
}