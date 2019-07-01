var axios = require('axios');

var getToken = async function( token ) {
  return new Promise(function(resolve, reject) {
    axios.get(process.env.API_TOKEN, { headers: { Authorization: token ? token : '' } })
    .then(function (response) {
      resolve(response.data);
    }).catch(function (error) {
      var err = error.response.data;
      resolve(err.auth);
    });
  });
};

var authToken = async function(token) {
  var res = await getToken(token);

  return new Promise(function(resolve, reject){
    resolve(res);
  });
};

module.exports.ValidateTokenMiddleware = function(req, res, next) {
  var authorization = req.headers.authorization;
  var x_api_key = req.headers['x-api-key'];
  var token = authorization ? authorization : x_api_key;

  if(!token) {
    token = false;
  }

  var xx = authToken(token);

  xx.then(function(r){
    if(r == false) {
      res.status(400).send({ auth: false, message: 'Failed to authenticate token.'});
      return;
    }

    req.token = r;

    next();
  });
};
