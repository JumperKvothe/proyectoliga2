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
    /*Comprobar si el jugador conectado tiene asignada una cuenta de league of legends para mostrar su 
    usuario o para darle la opción de verificar su cuenta*/ 
    case 4:
      comprobarCuentas()
      break;
  }
}

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

function comprobarCuentas(){
  if (err) throw err;
  console.log("Connected!");
  var verificado;
  //No olvidar \/
  eliteuser = "danireySvQ";
  // \/
  centro = "ELITE SEVILLA";
  var sql = "SELECT loluser FROM jugadores WHERE eliteuser LIKE = '" + eliteuser + "'";
  con.query(sql, function (err, result) {
    if (loluser = "" || loluser == null){
      verificado = false;
      //
    }else{
      $("#loluser").text(result)
      $("#verlol").hide
      verificado = true;
    }
    if (err) {
      throw err;
      verificado = false;
      crearRegistro(eliteuser, centro)
    }
  });

}

function crearRegistro(eliteuser, centro){
  var sql = "INSERT INTO jugadores (eliteuser, centro) VALUES ('" + eliteuser + "', '" + centro + "')";
    con.query(sql4, function (err, result) {
      if (err) throw err;
    });
}