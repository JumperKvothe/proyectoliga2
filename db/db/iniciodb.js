var mysql = require("mysql");

//Hay que mirar como cargar la conexión desde el main
var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario",
  multipleStatements: true
});

ipc.on('iniciodb', function (event, arg) {
    div_hide()
})

function div_hide(){
    document.getElementById('abc').style.display = "none";
}