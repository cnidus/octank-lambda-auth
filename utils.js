'use strict';

var uuid = require("uuid");

var headers = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'no-cache, no-store, must-revalidate'
}

module.exports.sendError = function (data, cb) {
  const response = {
    statusCode: 500,
    headers: {
      'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
      'Access-Control-Allow-Origin': '*' //Need to set this manually. API Gateway does not do it
    },
    body: JSON.stringify(data),
  };
  console.log("Response is: ", response);
  cb(null, response)
}

module.exports.ddbResponseHandler = function (error, data, cb) {
  if (error) {
    //cb(error)
    const response = {
      statusCode: 500,
      headers: {
        'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Access-Control-Allow-Origin': '*' //Need to set this manually. API Gateway does not do it
      },
      body: JSON.stringify({
        error: error
      }),
    };
    cb(null, response)
  } else {
    console.log("Response data is: ", data);

    const response = {
      statusCode: 200,
      headers: {
        'cache-control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Access-Control-Allow-Origin': '*' //Need to set this manually. API Gateway does not do it
      },
      body: JSON.stringify(data),
    };
    console.log("Response is: ", response);
    cb(null, response)
  }
}

module.exports.getCreateParams = function (event, body, tablename) {
  var request = body;
  request.id = uuid.v4();
  request.createdBy = event.requestContext.authorizer.principalId;

  var params = {
    TableName: "b3-" + event.requestContext.stage + "-" + tablename,
    Item: request
  };

  return params;
}

module.exports.getUpdateParams = function (event, tablename) {
  var updateExpression = "set ";
  var expressionAttributeValues = {}
  var request = JSON.parse(event.body);
  //console.log("Request is: ", request);

  for (var item in request) {
    updateExpression += item + " = :" + item + ", "
    expressionAttributeValues[":" + item] = request[item]
  }

  var params = {
    TableName: "b3-" + event.requestContext.stage + "-" + tablename,
    Key: {
      "id": event.pathParameters.id
    },
    UpdateExpression: updateExpression.substr(0, updateExpression.length - 2),
    ExpressionAttributeValues: expressionAttributeValues,
    //UpdateExpression: "set city = :city, hobby = :hobby",
    // ExpressionAttributeValues: {
    //   ":city": "Dallas",
    // ":p":"Everything happens all at once.",
    // ":a":["Larry", "Moe", "Curly"]
    // },
    ReturnValues: "UPDATED_NEW"
  }

  return params;
}