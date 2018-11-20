var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario"
});

function funcionesdb(number){

  switch (number){
    //Update cola1vs1 a 1 mientras un usuario busca rival
    case 1:
    updateColaInd()
  }
}

//Update cola1vs1 a 1 mientras un usuario busca rival
function updateColaInd(){
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      loluser="danireySvQ";
      var sql = "UPDATE jugadores SET colaind = 1 WHERE loluser LIKE '" + loluser + "'";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
      });
  });
}