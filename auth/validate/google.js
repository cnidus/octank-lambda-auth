'use strict';

var request = require("request");
var config = require("../config");
var AuthPolicy = require("./authpolicy");
/**
 * Validates a google id_token
 * Documentation @ https://developers.google.com/identity/sign-in/web/backend-auth
 *{
 // These six fields are included in all Google ID Tokens.
 "iss": "https://accounts.google.com",
 "sub": "123456789123456789334",
 "azp": "1234567891231-dhdgwywtwuwuywuyeuweui454.apps.googleusercontent.com",
 "aud": "1234567891231-dhdgwywtwuwuywuyeuweui454.apps.googleusercontent.com",
 "iat": "1433978353",
 "exp": "1433981953",

 // These seven fields are only included when the user has granted the "profile" and
 // "email" OAuth scopes to the application.
 "email": "testuser@gmail.com",
 "email_verified": "true",
 "name" : "Test User",
 "picture": "https://lh4.googleusercontent.com/-kYgzyAWpZzJ/ABCDEFGHI/AAAJKLMNOP/tIXL9Ir44LE/s99-c/photo.jpg",
 "given_name": "Test",
 "family_name": "User",
 "locale": "en"
}
 * @return - invalid, success
 */
//module.exports = function (id_token, callback) {
module.exports.validate = function (token, callback) {
    request.get(config.google.token_info_url + token, function (error, response, body) {
        if (error) {
            callback(null, "error")
        } else {
            var b = JSON.parse(body);

            if (b.error_description) {
                callback(new Error(b.error_description));
            } else if (b.aud === config.google.client_id) { //validate that token is from our app
                callback(null, JSON.parse(body));
            } else {
                callback(new Error("Google returned unknown error"));
            }
        }
    });
}

module.exports.getPolicy = function (options, callback) {

    if (!options.error) {
        const principalId = options.result.email;
        const policy = new AuthPolicy(principalId, options.awsAccountId, options.apiOptions);

        // options.apiOptions.requestedResource - will fine tune it later. This is good enough for now
        //policy.allowMethod(options.apiOptions.method, "/*"); //Resource is the URL to give access to. * is to give access to all
        policy.allowMethod("*", "/*");  //Allowing access for all the methods to enable auth result caching by APIG
        // finally, build the policy and exit the function
        callback(null, policy.build());
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