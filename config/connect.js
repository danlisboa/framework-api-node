require('pg').types.setTypeParser(1114, function(stringValue) {
  return new Date(stringValue + "+0000");
  // e.g., UTC offset. Use any offset that you would like.
});

var sequelize = require('sequelize');

var connect_pg = new sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD, {
    host: process.env.PG_HOST,
    dialect: process.env.PG_DIALECT,
    operatorsAliases: false,
    logging: false,
    timezone: "00:00",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
    }
  }
);

var connect_ms = new sequelize(
  process.env.MS_DATABASE,
  process.env.MS_USER,
  process.env.MS_PASSWORD, {
    host: process.env.MS_HOST,
    dialect: process.env.MS_DIALECT,
    dialectOptions: {
      encrypt: true,
    },
    operatorsAliases: false,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
    }
  }
);

module.exports = {
  'data_type' : sequelize,
  'pg' : connect_pg,
  'ms' : connect_ms
};