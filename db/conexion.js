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
    //if (conn) conn.release()
    callback(err, conn);
  });
};

/* exports.releaseCon = function (callback) {
  pool.releaseCon(function (err) {
    pool.getConnection(function (err, conn){
      if (err) throw err;
      conn.release()
    })
  });
} */