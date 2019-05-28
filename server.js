var express = require('express');
var fs = require('fs');
var https = require('https');
var path = require('path');
var bodyParser = require('body-parser');

var Houndify = require('houndify');


//parse arguments
var argv = require('minimist')(process.argv.slice(2));

//config file
var configFile = argv.config || 'config';
var config = require(path.join(__dirname, configFile));

//express app
var app = express();
var port = config.port || 8446;
var publicFolder = argv.public || 'public';
app.use(express.static(path.join(__dirname, publicFolder)));

//authenticates requests
app.get('/houndifyAuth', Houndify.HoundifyExpress.createAuthenticationHandler({ 
  clientId:  config.clientId, 
  clientKey: config.clientKey
}));

//sends the request to Houndify backend with authentication headers
app.post('/textSearchProxy', bodyParser.text({ limit: '1mb' }), Houndify.HoundifyExpress.createTextProxyHandler());



if (config.https) {

  //ssl credentials
  var privateKey = fs.readFileSync(config.sslKeyFile);
  var certificate = fs.readFileSync(config.sslCrtFile);
  var credentials = { key: privateKey, cert: certificate };

  //https server
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, function() {
    console.log("HTTPS server running on port", port);
    console.log("Open https://localhost:" + port, "in the browser to view the Web SDK demo");
  });

} else {

  app.listen(port, function() {
    console.log("HTTP server running on port", port);
    console.log("Open http://localhost:" + port, "in the browser to view the Web SDK demo");
  });

}

