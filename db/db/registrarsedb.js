var mysql = require("mysql");
var con

function conexion(datos){
  con = mysql.createConnection({
    host: datos[0],
    user: datos[1],
    password: datos[2],
    database: datos[3],
    multipleStatements: datos[4]
  });
}

ipc.on('registrarsedb', function (event, arg) {
  agregarUsuario()
})

//Meter un nuevo usuario en la base de datos
function agregarUsuario() {
  var eliteu = document.getElementsByName("nombre")[0].value;
  var cen = document.getElementsByName("centro")[0].value;
  var contra = document.getElementsByName("contrasena")[0].value;
  var sql = "SELECT * FROM jugadores WHERE eliteuser = '" + eliteu + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      if (result == "" && contra != "") {
        var sql2 =
          "INSERT INTO jugadores (eliteuser, centro, contrasena) VALUES ('" +
          eliteu + "', '" + cen + "', '" + contra + "')";
        con.query(sql2, function (err, result) {
          if (err) throw err;
          else gotologin();
        });
      } else {
        if (contra == "") {
          alert('No estableciste una contraseña')
        } else {
          alert('Nombre en uso')
        }
      }
    }
  });
}

ipc.on('prueba', function (event) {
  prueba();
})

function prueba() {
  console.log('12345')
}