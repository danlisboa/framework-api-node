var axios = require('axios');
log = require('./ComigoLog');

var adm_list = [
  {NAME_TO: 'Daniel Lisboa', email: 'daniel.lisboa@comigosaude.com.br'},
  {NAME_TO: 'Davide Barenghi', email: 'davide@comigosaude.com.br'},
];

module.exports.send_adm = function(mail_data) {
  try {
    var config_values = {};

    adm_list.forEach(function(i) {
      config_values = { NAME_TO: i.NAME_TO }

      mail_data.values = [Object.assign(config_values, mail_data.tmpl_var)];
      mail_data.to = i.email;

      axios.post(process.env.API_EMAIL_SMS, mail_data)
      .then(function (response) {
        process.stdout.write('email '+mail_data.emailType+' enviado \n');
      }).catch(function (error) {
        log('error', error, 'email-api');
      });
    });
  } catch (error) {
    log('error', error, 'email');
  }
};