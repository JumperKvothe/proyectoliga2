var mysql = require("mysql");

//Hay que mirar como cargar la conexión desde el main
var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario",
  multipleStatements: true
});

ipc.on('logindb', function (event, arg) {
  comprobarLogin()
})

//
function comprobarLogin() {
  let nombre = document.getElementById("nombre").value;
  let pass = document.getElementById("pass").value;
  let sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" +
    nombre + "' AND contrasena LIKE '" + pass + "'";
  console.log('comprobarLogin')
  con.query(sql, function (err, result) {
    console.log(result)
    console.log(sql)
    if (err) throw err;
    else {
      if (result == "") {
        alert("Usuario o contraseña erróneos");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(result[0]));
        conectarse();
        gotoinicio();
      }
    }
  });
}

//Hay que usarla en todos los unload postlogin
function conectarse() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let miid = user.idjugador;
  sql = "INSERT INTO gente_online (id, fecha) VALUES (" + miid + ", NOW())";
  con.query(sql, function(err, result) {
    if (err) throw err;
  });
  ipc.send("user-logueado", miid);
}