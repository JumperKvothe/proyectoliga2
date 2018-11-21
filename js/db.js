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
      matchMakingInd();
      break
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
    console.log(result);
    console.log(njug);
    if (njug % 2 != 0) {
      njug - 1
    }
    for (i = 0; i < njug; i++) {
      jug1 = result[i].loluser
      console.log(jug1)
      if (i != njug - 1) {
        i++;
        jug2 = result[i].loluser
        console.log(jug2)
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