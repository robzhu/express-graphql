
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.renderGraphiQL = renderGraphiQL;

// Current latest version of GraphiQL.
var GRAPHIQL_VERSION = '0.2.4';

/**
 * When express-graphql receives a request which does not Accept JSON, but does
 * Accept HTML, it may present GraphiQL, the in-browser GraphQL explorer IDE.
 *
 * When shown, it will be pre-populated with the result of having executed the
 * requested query.
 */

function renderGraphiQL(data) {
  var queryString = data ? data.query : null;
  var variablesString = data && data.variables ? JSON.stringify(data.variables, null, 2) : null;
  var resultString = data && data.result ? JSON.stringify(data.result, null, 2) : null;

  /* eslint-disable max-len */
  return '<!--\nThe request to this GraphQL server provided the header "Accept: text/html"\nand as a result has been presented GraphiQL - an in-browser IDE for\nexploring GraphQL.\n\nIf you wish to receive JSON, provide the header "Accept: application/json" or\nadd "&raw" to the end of the URL within a browser.\n-->\n<!DOCTYPE html>\n<html>\n<head>\n  <link href="//cdn.jsdelivr.net/graphiql/' + GRAPHIQL_VERSION + '/graphiql.css" rel="stylesheet" />\n  <script src="//cdn.jsdelivr.net/fetch/0.9.0/fetch.min.js"></script>\n  <script src="//cdn.jsdelivr.net/react/0.13.3/react.min.js"></script>\n  <script src="//cdn.jsdelivr.net/graphiql/' + GRAPHIQL_VERSION + '/graphiql.min.js"></script>\n  <style>\n    .box {\n      display: flex;\n      flex-flow: column;\n      height: 100%;\n    }\n\n    .box .row {\n      border: 1px dotted grey;\n      flex: 0 1 30px;\n    }\n\n    .box .row.header {\n      font-family: Sans-Serif;\n      flex: 0 1 auto;\n      width: 100%;\n    }\n\n    .box .row.content {\n      flex: 1 1 auto;\n      height: 95%;\n    }\n\n    .box .row.footer {\n      flex: 0 1 40px;\n    }\n  </style>\n</head>\n<body>\n\n  <div class="box">\n    <div class="row header">\n      <label for=\'auth\'>Authorization Header:</label>\n      <input type=\'text\' id=\'auth\' accesskey="a"/>\n    </div>\n    <div class="row content" id="main" />\n    <div class="row footer" />\n  </div>\n\n  <script>\n    // Collect the URL parameters\n    var parameters = {};\n    window.location.search.substr(1).split(\'&\').forEach(function (entry) {\n      var eq = entry.indexOf(\'=\');\n      if (eq >= 0) {\n        parameters[decodeURIComponent(entry.slice(0, eq))] =\n          decodeURIComponent(entry.slice(eq + 1));\n      }\n    });\n\n    // Produce a Location query string from a parameter object.\n    function locationQuery(params) {\n      return \'?\' + Object.keys(params).map(function (key) {\n        return encodeURIComponent(key) + \'=\' +\n          encodeURIComponent(params[key]);\n      }).join(\'&\');\n    }\n\n    // Derive a fetch URL from the current URL, sans the GraphQL parameters.\n    var graphqlParamNames = {\n      query: true,\n      variables: true,\n      operationName: true\n    };\n\n    var otherParams = {};\n    for (var k in parameters) {\n      if (parameters.hasOwnProperty(k) && graphqlParamNames[k] !== true) {\n        otherParams[k] = parameters[k];\n      }\n    }\n    var fetchURL = locationQuery(otherParams);\n\n    // Defines a GraphQL fetcher using the fetch API.\n    function graphQLFetcher(graphQLParams) {\n      return fetch(fetchURL, {\n        method: \'post\',\n        headers: {\n          \'Content-Type\': \'application/json\',\n          \'Authorization\': document.getElementById(\'auth\').value\n        },\n        body: JSON.stringify(graphQLParams),\n      }).then(function (response) {\n        return response.json()\n      });\n    }\n\n    // When the query and variables string is edited, update the URL bar so\n    // that it can be easily shared.\n    function onEditQuery(newQuery) {\n      parameters.query = newQuery;\n      updateURL();\n    }\n\n    function onEditVariables(newVariables) {\n      parameters.variables = newVariables;\n      updateURL();\n    }\n\n    function updateURL() {\n      history.replaceState(null, null, locationQuery(parameters));\n    }\n\n    // Render <GraphiQL /> into the body.\n    React.render(\n      React.createElement(GraphiQL, {\n        fetcher: graphQLFetcher,\n        onEditQuery: onEditQuery,\n        onEditVariables: onEditVariables,\n        query: ' + JSON.stringify(queryString) + ',\n        response: ' + JSON.stringify(resultString) + ',\n        variables: ' + JSON.stringify(variablesString) + '\n      }),\n      document.getElementById(\'main\')\n    );\n  </script>\n</body>\n</html>';
}