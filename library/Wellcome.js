var set_env = require('../config/env/set_env');
var service_name = require('../config/env/service_name');

module.exports.display =  function boot( app ) {
  var api_wellcome = [
    process.env.APP_NAME,
    'running',
    service_name.get(),
    'in',
    set_env.get ? set_env.get : 'not found',
    'port:',
    process.env.SERVER_PORT
  ];

  return api_wellcome.join(' ')
};