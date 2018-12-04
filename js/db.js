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
  // \/
  var centro = "Sevilla";
  var sql = "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" + eliteuser + "'";
  con.query(sql, function (err, result) {
    console.log(result)
    var r = result[0].loluser
    console.log(r)
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
    if (err) {
      //throw err;
      yaverificado(false)
      console.log("error cabesa")
      crearRegistro(eliteuser, centro)
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

function agregarusuario(){
  var eliteuser = document.getElementsByName("nombre")[0].value;
  var centro = documment.getElementsByName("centro")[0].value;
  var contrasena = document.getElementsByName("contrasena")[0].value;
  var sql = "INSERT INTO jugadores (eliteuser, centro, contrasena) VALUES ('" + eliteuser + "', '" + centro + 
  "', '" + contrasena + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    else gotoindex();
  });
}

//Comprobar si los datos de login son correctos
function comprobarLogin(){
  let nombre = document.getElementById('nombre').value
  let pass = document.getElementById('pass').value
  let sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" + nombre + "' AND contrasena LIKE '" + pass + "'"
  con.query(sql, function (err, result){
    if(err) throw err;
    else{
      if (result == ""){
        alert("Usuario o contraseña erróneos")
      }else{
       localStorage.setItem('currentUser', result[0]);
       gotoinicio()
      }
    }
  })
}