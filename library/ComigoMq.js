var amqp = require('amqplib/callback_api');
var log = require('./ComigoLog');


module.exports.send = function(m, callback, debug) {
  var connect = {
    rabbit: process.env.RABBITMQ,
    queue_medical_order: process.env.MEDICAL_ORDER_QUEUE,
  }

  amqp.connect(connect.rabbit, function (error0, connection) {
    if (error0) {
      log('error', {msg: 'Problemas ao abrir conexão com o mensageiro - ' + error0, data: m}, 'comigoMQ');
      return;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      channel.assertQueue(connect.queue_medical_order, {
        durable: false
      });

      var status_send = channel.sendToQueue(connect.queue_medical_order, Buffer.from(JSON.stringify(m)));

      if (!status_send) {
        log('error', {msg: 'Problemas ao enviar dados para o mensageiro', data: m}, 'comigoMQ');
        return;
      }

      if (debug) {
        console.log("ComigoMq Sent %s", Buffer.from(JSON.stringify(m)));
      }

      callback(m);
    });
  });
};