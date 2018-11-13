var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario"
});

/* con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
}); */

//Ejemplo Insert
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO jugadores (user, loluser, puntos, centro, colaind)"
    + " VALUES ('danireySvQ', 'danireySvQ', 1000, 'ELITE MADRID', 0)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      /* console.log("Result: " + result); */
      console.log("1 record inserted");
    });
  });  

//Update cola1vs1 a 1 mientras un usuario busca rival
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "UPDATE jugadores SET colaind = 1 WHERE user LIKE '" + nombre + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
    });
});