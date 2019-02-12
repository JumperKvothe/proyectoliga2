var mysql = require("mysql");
var con
var CryptoJS = require("crypto-js")

function conexion(datos) {
  con = mysql.createConnection({
    host: datos[0],
    user: datos[1],
    password: datos[2],
    database: datos[3],
    multipleStatements: datos[4]
  });
}

ipc.on('logindb', function (event, arg) {
  conexion(arg)
  comprobarLogin()
})

//Función que controla el login de la aplicación
function comprobarLogin() {
  let nombre = document.getElementById("nombre").value;
  let pass = document.getElementById("pass").value;
  let sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" +
    nombre + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    if (result.length == 1) {
      let bytes = CryptoJS.AES.decrypt(result[0].contrasena, 'SvQ');
      let decpass = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      if (pass == decpass) {
        //almaceno el usuario en la aplicación por si me hiciera falta acceder a él ahorrando conexiones a la bbdd
        localStorage.setItem("currentUser", JSON.stringify(result[0]));
        addOnline()
        goToInicio()
        return
      }
    }
    con = null;
    alert('Usuario o contraseña erróneos')
  });
}

//Añadir el jugador logueado correctamente a la tabla de usuarios online
async function addOnline() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let miid = user.idjugador;
  let sql = "SELECT * FROM gente_online WHERE id = " + miid
  con.query(sql, function (err, result) {
    if (err) throw err
    //Si por alguna razón el usuario de la bbdd no se desconectó correctamente se actualiza su hora de login
    if (result.length == 1) {
      let sql2 = "UPDATE gente_online SET fecha = NOW() WHERE id = " + miid
      con.query(sql2, function (err, result) {
        if (err) throw err
      });
    //Se inserta en gente_online
    } else {
      let sql3 = "INSERT INTO gente_online (id, fecha) VALUES (" + miid + ", NOW())";
      con.query(sql3, function (err, result) {
        if (err) throw err
      });
    }
    con = null
  });
  ipc.send("user-logueado", miid);
}