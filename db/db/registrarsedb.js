var CryptoJS = require("crypto-js");
const mysqlcon = require('../conexion')

ipc.on('registrardb', function (event) {
  agregarUsuario()
})

//Consultar si existe el usuario a registrar
function agregarUsuario() {
  var eliteu = document.getElementById('nombre').value;
  var sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" + eliteu + "'";
  mysqlcon.getConnection(function (err, con) {
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
    con.release();
  });
}

//Inserta al usuario
function insertarUsuario() {
  var eliteu = document.getElementById('nombre').value;
  var cen = document.getElementById("centro").value;
  var contra = document.getElementById("pass").value;
  var encpass = CryptoJS.AES.encrypt(contra, 'SvQ').toString();
  /* Genero de forma random que los jugadores tengan puntos para probar aspectos como la clasificación y
   para dejar abierta la implementación de los puntos tal como se desee */
  var puntos = Math.floor(Math.random() * 5000);
  var sql = "INSERT INTO jugadores (eliteuser, centro, contrasena, puntos) VALUES ('" +
    eliteu + "', '" + cen + "', '" + encpass + "', " + puntos + ")";
  mysqlcon.getConnection(function (err, con) {
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        alert('Usuario creado con éxito')
        goToLogin()
      }
    });
    con.release();
  });
}