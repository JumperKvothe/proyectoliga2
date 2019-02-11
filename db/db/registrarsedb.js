var mysql = require("mysql");
var con
var CryptoJS = require("crypto-js");

function conexion(datos) {
  con = mysql.createConnection({
    host: datos[0],
    user: datos[1],
    password: datos[2],
    database: datos[3],
    multipleStatements: datos[4]
  });
}

ipc.on('registrardb', function (event, arg) {
  conexion(arg)
  agregarUsuario()
})

//Meter un nuevo usuario en la base de datos
//Repasar cuando esté online
function agregarUsuario() {
  var eliteu = document.getElementById('nombre').value;
  var sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" + eliteu + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      if (result.length == 0) {
        insertarUsuario()
      } else {
        con = null;
        alert('Nombre de usuario en uso, pruebe con otro')
      }
    }
  });
}

//Falta encriptar la contraseña
function insertarUsuario() {
  var eliteu = document.getElementById('nombre').value;
  var cen = document.getElementById("centro").value;
  var contra = document.getElementById("pass").value;
  var encpass = CryptoJS.AES.encrypt(contra, 'SvQ').toString();
  var sql = "INSERT INTO jugadores (eliteuser, centro, contrasena) VALUES ('" +
    eliteu + "', '" + cen + "', '" + encpass + "')";
  con.query(sql, function (err, result) {
    con = null
    if (err) throw err;
    else {
      alert('Usuario creado con éxito')
      goToLogin()
    }
  });
}