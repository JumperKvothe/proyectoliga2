var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario",
  multipleStatements: true
});

function funcionesdb(num) {

  switch (num) {
    //Update cola1vs1 a 1 mientras un usuario busca rival
    case 1:
      updateColaInd()
      break
    //Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
    case 2:
      /* setInterval(function () {
        matchMakingInd();
      }, 1000) */
      matchMakingInd()
      break
    case 3:
      anadirJug()
      break;
    //Comprobar si al pulsar la imagen del lol el usuario está verificado o no
    case 4:
      comprobarLol()
      break;
    //Consultar los puntos de un jugador para mostrarlos en la interfaz  
    case 5:
      consultarPuntos()
      break;
    //Guardar un nuevo usuario en la base de datos
    case 6:
      agregarusuario()
      break;
    //Comprobar si los datos de login son correctos
    case 7:
      comprobarLogin()
  }
}

/* funcion sacar nombre  
  GET de nombreelite sacamos en una consulta el nomlol
    llamamos a la funcion de funcionesdb.js donde usaremos el league.js 
    a partir de su nombre para ponerlo en el index */

//Update cola1vs1 a 1 mientras un usuario busca rival
function updateColaInd() {
  if (err) throw err;
  console.log("Connected!");
  //No olvidar \/
  loluser = "danireySvQ";
  var sql = "UPDATE jugadores SET colaind = 1 WHERE loluser LIKE '" + loluser + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
  });
}

//Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
function matchMakingInd() {
  var njug = 0;
  var jug1, jug2 = "";
  var sql = "SELECT puntos, loluser FROM jugadores WHERE colaind=1 ORDER BY puntos";
  con.query(sql, function (err, result) {
    njug = result.length
    if (njug % 2 != 0) {
      njug - 1
    }
    for (i = 0; i < njug; i++) {
      jug1 = result[i].loluser
      if (i != njug - 1) {
        i++;
        jug2 = result[i].loluser
        setValue(jug1, jug2);
      }
    }
    if (err) throw err;

  });

  function setValue(valor1, valor2) {
    jug1 = valor1;
    jug2 = valor2;
    var sql2 = "UPDATE jugadores SET colaind = 0 WHERE loluser LIKE '" + jug1 + "'";
    con.query(sql2, function (err, result) {
      if (err) throw err;
    });
    var sql3 = "UPDATE jugadores SET colaind = 0 WHERE loluser LIKE '" + jug2 + "'";
    con.query(sql3, function (err, result) {
      if (err) throw err;
    });
    var sql4 = "INSERT INTO 1vs1 (inv1, inv2) VALUES ('" + jug1 + "', '" + jug2 + "')";
    con.query(sql4, function (err, result) {
      if (err) throw err;
    });
  }
}

function anadirJug() {
  var njug, pts = 0;
  var jug, centro = "";
  var sql = "SELECT * FROM jugadores ORDER BY puntos DESC";
  con.query(sql, function (err, result) {
    njug = result.length

    for (i = 0; i < njug; i++) {
      jug = result[i].loluser
      pts = result[i].puntos
      centro = result[i].centro
      setValue(jug, pts, centro, i);
    }
    if (err) throw err;
  });

  function setValue(valor1, valor2, valor3, valor4) {
    jug = valor1;
    pts = valor2;
    centro = valor3;
    i = valor4;
    $(".juga").append(function () {
      return '<tr class="odd"><th scope="row">' + (i + 1) + '</th><td>' + jug + '</td><td>' +
        pts + '</td><td>' + centro + '</td></tr>';
    });
  }
}

function comprobarLol(){
  //No olvidar \/
  var eliteuser = "Enrique";

  var sql = "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" + eliteuser + "'";
  con.query(sql, function (err, result) {
    console.log(result)
    var r = result[0].loluser
    console.log(r)    
    if (err) {
      throw err;
    }
    else {
      if (r == "" || r == null){
        yaverificado(false)      
        console.log("false amigo")
        
      }else{
        yaverificado(true)
          if (typeof(Storage) !== "undefined") {
          localStorage.setItem('loluser', r);
        } else {
            console.log("No lo soporta el navegador")
        }
          console.log("true amigo")
      }
    }
  });

}
  
function addnom (loluser)
{
  console.log(loluser)
  var eliteuser = "Enrique"
  //Hay que coger el Elite User
  var sql = "UPDATE jugadores SET loluser = '" + loluser + "' WHERE eliteuser LIKE '" + eliteuser + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      else gotoindex()
    });
}

function consultarPuntos(){

  var nombrel = sessionStorage.getItem('loluser');
  console.log(nombrel)
  var sql = "SELECT puntos FROM jugadores WHERE loluser LIKE '" + nombrel + "'";
  con.query(sql, function (err, result) {
    console.log(result)
    let puntos = result[0].puntos
    console.log(puntos)
    getpuntos(puntos)
    if (err) throw err;
  });
}

//Meter un nuevo usuario en la base de datos
function agregarusuario(){
  var eliteu = document.getElementsByName("nombre")[0].value;
  var cen = document.getElementsByName("centro")[0].value;
  var contra = document.getElementsByName("contrasena")[0].value;
  var sql = "SELECT * FROM jugadores WHERE eliteuser = '" + eliteu + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      if (result=="" && contra!="")
      {
        var sql2 = "INSERT INTO jugadores (eliteuser, centro, contrasena) VALUES ('" + eliteu + "', '" + cen + 
        "', '" + contra + "')";
        con.query(sql2, function (err, result) {
          if (err) throw err;
          else gotologin();
        });
      }
      else{alert("Nombre de usuario en uso o no hay contraseña");}
    }
  });
}

//Comprobar si los datos de login son correctos
function comprobarLogin(){
  let nombre = $('#nombre').val
  let pass = $('#pass').val
  show.console(nombre)
}