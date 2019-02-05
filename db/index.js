//La variable global de la conexión utilizada en los métodos de ./db
var mysql = require("mysql");
var conex;
var con = mysql.createConnection({
    host: conex[0],
    user: conex[1],
    password: conex[2],
    database: conex[3],
    multipleStatements: conex[4]
});

/* con.connect(function(error){
    if(!!error){
      console.log(error);
    }else{
      console.log('Connected!:)');
    }
  }); */

module.exports = con