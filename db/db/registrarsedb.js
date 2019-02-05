var mysql = require("mysql");

//Hay que mirar como cargar la conexión desde el main
var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario",
  multipleStatements: true
});

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