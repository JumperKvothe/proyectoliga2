var mysql = require('mysql');
var config = require('./config.json')

//Se crea un pool con la conexión cargada de un json
var pool = mysql.createPool(
  config
);

//Se exporta el método de conexión a los js de modelo
exports.getConnection = function (callback) {
  pool.getConnection(function (err, conn) {
    if (err) {
      return callback(err);
    }
    callback(err, conn);
  });
};