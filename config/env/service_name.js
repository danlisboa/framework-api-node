module.exports.get = function () {
  var fs = require('fs');
  var service = false;

  fs.readdirSync('.').forEach(file => {
    if(!Boolean(file.search("api-"))) {
      service = file;
    }
  });

  return service;
}