var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario"
});

function funcionesdb(num) {

  switch (num) {
    //Update cola1vs1 a 1 mientras un usuario busca rival
    case 1:
      updateColaInd()
      break
      //Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
    case 2:
      setInterval(function () {
        matchMakingInd();
      }, 1000)
      break
  }
}

//Update cola1vs1 a 1 mientras un usuario busca rival
function updateColaInd() {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    //No olvidar \/
    loluser = "danireySvQ";
    var sql = "UPDATE jugadores SET colaind = 1 WHERE loluser LIKE '" + loluser + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });
  });
}

//Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
function matchMakingInd() {
  con.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT puntos, loluser FROM JUGADORES WHERE colaind=1 ORDER BY puntos";
    con.query(sql, function (err, result) {
      var njug = result.affectedRows;
      var a = result.loluser;
      
      if (err) throw err;      
    });

    for (i = 0; i <= njug; i++) {
        
        i++;
        
        
      }
      var sql2 = "UPDATE jugadores SET colaind = 0 WHERE loluser LIKE '" + result.loluser[i] + "'";
        con.query(sql2, function (err, result) {
          if (err) throw err;
        });
        var sql3 = "UPDATE jugadores SET colaind = 0 WHERE loluser LIKE '" + result.loluser[i] + "'";
        con.query(sql3, function (err, result) {
          if (err) throw err;
        });
        var sql4 = "INSERT INTO 1vs1 (inv1, inv2) VALUES ('" + result.loluser[i - 1] + "', '" + result.loluser[i] + "')";
        con.query(sql4, function (err, result) {
          if (err) throw err;
        });
  });
}