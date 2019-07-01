var service_name = require('../config/env/service_name');
var connection = require('../config/connect');
var log = require('./ComigoLog');

var getModel = function(model) {
  try {
    var path_models = [service_name.get(), '/src/models/'].join('');
    var req_model = [path_models, model];
    var file_name_model = '../'+req_model.join('');
    var Model = require(file_name_model);

    return Model;
  } catch (e) {
    console.log('deu erro', file_name_model);
    console.log(e);
    log('error',
      'problems to find model in ComigoOrm '+ file_name_model,
      'comigo-orm'
    );

    log('error', e, 'comigo-orm');
  }
};

function getConnection (database) {
  database = database ? database.toLowerCase() : false;

  var database_list = {
    'pg': connection.pg,
    'ms': connection.ms,
    'default': false
  };

  return (database_list[database] || database_list['default']);
}

var query = function (query, bd, model = false) {
  var database = getConnection(bd);

  if (!database) {
    reject({
      code: 400,
      msg: 'Problemas na conexão',
      data: []
    });
  }

  var instModel = model ? getModel(model) : false;
  var configModel = {};

  if(instModel) {
    configModel ={
      model: instModel,
      mapToModel: true
    }
  }

  var promise = new Promise(function(resolve, reject) {
    database.query(query, configModel).spread((results, metadata) => {
      resolve({
        code: 200,
        msg: '',
        data: results
      });
    }).catch(function(e) {
      if(e.name == 'SequelizeDatabaseError') {
        log('error', e, 'orm-query');

        reject({
          code: 400,
          msg: 'Problemas ao realizar consulta',
          data: []
        });
      }
    });
  });

  return promise;
};

var insert = function(obj, model, transaction) {
  obj.active_yn = 'Y';

  var promise = new Promise(function(resolve, reject) {
    var instModel = getModel(model);

    if(!instModel) {
      log('error', 'Problema inesperado Orm', model);

      reject({
        code: 400,
        msg: 'Problema inesperado Orm',
        data: []
      });
    }
    var unsaved = instModel.build(obj);

    unsaved.save({transaction: transaction}).then(function(r){
      resolve({
        code: 201,
        msg: 'registro inserido',
        data: r._previousDataValues,
        dataValues: r.dataValues
      });
    }).catch(function(e) {
      var obj_ret = {};
      var e_list = [];

      if(e.name == 'SequelizeValidationError') {
        e.errors.forEach(ruim => {
          obj_ret.message = ruim.message;
          obj_ret.type = ruim.type;
          obj_ret.field = ruim.path;
          obj_ret.value = ruim.value;

          e_list.push(obj_ret);
          obj_ret = {};
        });

        reject({
          code: 400,
          msg: '',
          data: e_list
        });
      } else {
        log('error', e, model);

        reject({
          code: 400,
          msg: 'Problemas ao inserir registro',
          data: []
        });
      }
    });
  });

  return promise;
};

var updateById = function(id, obj, model) {
  var instModel = getModel(model);

  obj.updated_at = Date.now();

  var promise = new Promise(function(resolve, reject) {
    instModel.findByPk(id).then(reg => {
      if(!reg) {
        reject({
          code: 400,
          msg: 'Registro não encontrado',
          data: []
        });

        return;
      }

      reg.update(obj).then(() => {
        resolve({
          code: 200,
          msg: 'registro atualizado',
          data: []
        });
      }).catch(function(e) {
        var obj_ret = {};
        var e_list = [];

        if(e.name == 'SequelizeValidationError') {
          e.errors.forEach(ruim => {
            obj_ret.message = ruim.message;
            obj_ret.type = ruim.type;
            obj_ret.field = ruim.path;
            obj_ret.value = ruim.value;

            e_list.push(obj_ret);
            obj_ret = {};
          });

          reject({
            code: 400,
            msg: '',
            data: e_list
          });
        }

        if(e.name == 'SequelizeDatabaseError') {
          log('error', e, model);

          reject({
            code: 400,
            msg: 'Problemas ao atualizar registro',
            data: []
          });
        }
      });
    }).catch(function(e) {
      if(e.name == 'SequelizeDatabaseError') {
        log('error', e, model);

        reject({
          code: 400,
          msg: 'Problemas ao localizar registro',
          data: []
        });
      }
    });
  });

  return promise;
};

var removeById = function(id, model) {
  var promise = new Promise(function(resolve, reject) {
    updateById(id, {active_yn: 'N'}, model).then(function(ret){
      if(ret.code == 200) {
        resolve({
          code: 200,
          msg: 'registro removido com sucesso',
          data: []
        });
      }
    }).catch(function(){
      reject({
        code: 200,
        msg: 'Problemas ao remover registro',
        data: []
      });
    });
  });

  return promise;
};

var getRegByid = function(id, model) {
  var instModel = getModel(model);

  var promise = new Promise(function(resolve, reject) {
    instModel.findByPk(id).then(reg => {
      if(!reg) {
        reject({
          code: 400,
          msg: 'Registro não encontrado',
          data: []
        });
      }

      resolve({
        code: 200,
        msg: '',
        data: reg
      });
    }).catch(function(e) {
      if(e.name == 'SequelizeDatabaseError') {
        log('error', e, model);

        reject({
          code: 400,
          msg: 'Problemas ao localizar registro',
          data: []
        });
      }
    });
  });

  return promise;
};

module.exports = {
  'dataType': connection.data_type,
  'query' : query,
  'insert' : insert,
  'updateById' : updateById,
  'removeById' : removeById,
  'getRegByid': getRegByid,
  'getConnection': getConnection
};