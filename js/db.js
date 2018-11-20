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
    //Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
    case 2:
    setInterval(function(){matchMakingInd();}, 60000)
  }
}

//Update cola1vs1 a 1 mientras un usuario busca rival
function updateColaInd(){
  con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      //No olvidar \/
      loluser="danireySvQ";
      var sql = "UPDATE jugadores SET colaind = 1 WHERE loluser LIKE '" + loluser + "'";
      con.query(sql, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
      });
  });
}

//Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
function matchMakingInd(){

}