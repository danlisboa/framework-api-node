require('custom-env').env(true, 'config/env');

var service_name = require('./config/env/service_name');
var set_env = require('./config/env/set_env');

service_name = service_name.get();

if (set_env.get) {
  require('custom-env').env(
    set_env.get,
    ['.', service_name, process.env.PATH_ENV_SERVICE].join('/')
  );
}

var express = require('express');
var wellcome = require('./library/Wellcome');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cors = require('cors');
var fs = require('fs');
var connect = require('./config/connect');
var _RouteBootstrap = [service_name,process.env._RouteBootstrap].join('');

connect.pg.authenticate().then(() => {
  console.log('Connection has been established successfully in ' + process.env.PG_DATABASE +'-'+ process.env.PG_HOST);
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.get('/', function (req, res) {
  res.send(wellcome.display());
});

try {
  if (fs.existsSync(_RouteBootstrap)) {
    var routes = require(['./', _RouteBootstrap].join(''));
    routes.boot(app);
  } else {
    console.log('[WARNING] Please create file _RouteBootstrap in service-name/src/routes');
  }
} catch(err) {
  console.error('fail to load ', err);
}

var is_https = JSON.parse(process.env.HTTPS);

if(is_https) {
  var https = require('https');

  require('ssl-root-cas/latest').inject().addFile(__dirname + process.env.CRT_FILE);

  try {
    var pfx = fs.readFileSync(__dirname + process.env.PFX_FILE);

    var options = {
      pfx: pfx,
      passphrase: process.env.PASSPHRASE_PFX,
      ca: [
        fs.readFileSync(__dirname + process.env.CRT_BUNDLE_01),
        fs.readFileSync(__dirname + process.env.CRT_BUNDLE_02),
        fs.readFileSync(__dirname + process.env.CRT_BUNDLE_03)
      ]
    };
  } catch(err) {
    console.error('fail to load crt ', err);
  }

  server = https.createServer(options);
  server.on('request', app);
  server.listen(process.env.SERVER_PORT, function(){
    process.stdout.write(wellcome.display() + ' HTTPS');
    process.stdout.write('\n\n');
  });
} else {
  app.listen(process.env.SERVER_PORT, function () {
    process.stdout.write(wellcome.display() + ' HTTP');
    process.stdout.write('\n\n');
  });
}

var args = process.argv.slice(2);

switch (args[0]) {
case 'test':
  process.stdout.write('Close instance to run unit test \n');
  server.close();
  break;
}

module.exports = app;

module.exports.stop_app = function () {
  server.close(function(){
    process.stdout.write('\n Stopping server express \n');
  });
};