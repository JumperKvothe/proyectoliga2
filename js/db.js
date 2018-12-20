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
      break;
      //Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
    case 2:
      /* setInterval(function () {
        matchMakingInd();
      }, 1000) */
      /* matchMakingInd() */
      break;
      //Escoger a los jugadores con más puntos para ponerlos en la clasificación
    case 3:
      clasificacion()
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
      agregarUsuario()
      break;
      //Comprobar si los datos de login son correctos
    case 7:
      comprobarLogin()
      break;
  }
}

//Revisar
//Update cola1vs1 a 1 mientras un usuario busca rival
function updateColaInd() {
  let user = JSON.parse(localStorage.getItem('currentUser'))
  var sql = "UPDATE jugadores SET colaind = 1 WHERE eliteuser LIKE '" + user.eliteuser + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
}

//Revisar
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

  //Sacamos a los jugadores de cola y los metemos en una sala
  //Falta generar tournament code
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

//Escoger a los jugadores con más puntos para ponerlos en la clasificación
function clasificacion() {
  let pag = parseInt(document.getElementById('tablita').value)
  let njug, pts, jug, centro, maxpag;
  let sql = "SELECT * FROM jugadores"
  con.query(sql, function (err, result) {
    njug = result.length
    maxpag = njug/7
    if (njug%7 != 0){
      maxpag++
    }
    if(pag <= maxpag){
      query()
    }else{
      document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) -1
    }
    if (err) throw err;
  });

  //Consulta los jugadores de la página actual de la clasificación
  function query(){
    var sql2 = "SELECT * FROM jugadores ORDER BY puntos DESC, eliteuser LIMIT " + (pag-1)*7 + ", 7";
    con.query(sql2, function (err, result) {
      njug = result.length
      $(".clas").empty();
      for (i = 0; i < njug; i++) {
        jug = result[i].eliteuser
        pts = result[i].puntos
        centro = result[i].centro
        setValue2(jug, pts, centro, i);
      }
      if (err) throw err;
    });
  }
  
  //Crea las filas de la tabla de clasificación
  function setValue2(jug, pts, centro, i) {
    $(".clas").append(function () {
      return '<tr class="odd"><th scope="row">' + (i + (pag-1)*7 + 1) + '</th><td>' + jug + '</td><td>' +
        pts + '</td><td>' + centro + '</td></tr>';
    });
  }
}

//Revisar
//Comprobar si el usuario actual ha validado su cuenta de lol
function comprobarLol() {
  let user = JSON.parse(localStorage.getItem('currentUser'))
  var sql = "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'";
  con.query(sql, function (err, result) {
    console.log(result)
    var r = result[0].loluser
    if (err) throw err
    else {
      //No la tiene validada
      if (r == "" || r == null) {
        div_show();
        //La tiene validada
      } else {
        gotoindex()
      }
    }
  });

}

//Revisar
function addnom(loluser, elo) {
  console.log(loluser)
  let user = JSON.parse(localStorage.getItem('currentUser'))
  console.log(user.eliteuser)
  var sql = "UPDATE jugadores SET loluser = '" + loluser + "', elo = " + elo + " WHERE eliteuser LIKE '" + user.eliteuser + "'";
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      gotoindex()
      user = JSON.parse(localStorage.getItem('currentUser'))
      localStorage.setItem('currentUser', JSON.stringify(user['loluser'] = loluser))
    }
  });
}

//Revisar
//Sacar los puntos que tiene el usuario en su cuenta
function consultarPuntos() {
  let user = JSON.parse(localStorage.getItem('currentUser'))
  var sql = "SELECT puntos FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'";
  con.query(sql, function (err, result) {
    console.log(result)
    let puntos = result[0].puntos
    console.log(puntos)
    $('.puntos').html(puntos);
    if (err) throw err;
  });
}

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
        var sql2 = "INSERT INTO jugadores (eliteuser, centro, contrasena) VALUES ('" + eliteu + "', '" + cen +
          "', '" + contra + "')";
        con.query(sql2, function (err, result) {
          if (err) throw err;
          else gotologin();
        });
      } else {
        alert("Nombre de usuario en uso o no hay contraseña");
      }
    }
  });
}

//Comprobar si los datos de login son correctos
function comprobarLogin() {
  let nombre = document.getElementById('nombre').value
  let pass = document.getElementById('pass').value
  let sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" + nombre + "' AND contrasena LIKE '" + pass + "'"
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      if (result == "") {
        alert("Usuario o contraseña erróneos")
      } else {
        localStorage.setItem('currentUser', JSON.stringify(result[0]));
        gotoinicio()
      }
    }
  })
}

//Buscar el rival más cercano en puntos
function buscarRival() {
  let user = JSON.parse(localStorage.getItem('currentUser'));
  let puntos1 = 0;
  let puntos2 = 0;
  let nombrelol2 = 0;
  var sql = "SELECT puntos, loluser FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'";
  con.query(sql, function (err, result) {
    console.log(result)
    puntos1 = result[0].puntos
    $(".nombre").html(result[0].loluser);
    $('.puntos').html(result[0].puntos);
    setInterval(setValue3(puntos1, result[0].loluser), 1000);
    if (err) throw err;
  });

  //Solucionar que cuando no haya ninguno con menos puntos vaya al siguiente por arriba
  //Si tampoco hay más por arriba y está sólo que se quede buscando
  //Y que los que encuentre, hacer como en matchmakingind y que me ponga sus colaind a 0
  //Matchmakingind está comentada ahora mismo
  function setValue3(punto, nelite) {
    var sql2 = "SELECT puntos, loluser FROM jugadores WHERE colaind=1 AND puntos <=" + punto +
      " AND loluser != '" + nelite + "' ORDER BY puntos DESC LIMIT 1";
    con.query(sql2, function (err, result) {
      console.log(result)
      nombrelol2 = result[0].loluser
      puntos2 = result[0].puntos
      $('.nombre2').html(nombrelol2);
      $('.puntos2').html(puntos2);
      if (err) throw err;
    });
  }
}

//Función para sacar la lista de equipos
function listaE() {
  let user = JSON.parse(localStorage.getItem('currentUser'));
  let id = user.idjugador;
  var sql = "SELECT nombre FROM equipos WHERE idj1= " + id + " OR idj2= " + id + " OR idj3= " + id +
    " OR idj4= " + id + " OR idj5= " + id + " OR idj6= " + id + " OR idj7= " + id + "";
  con.query(sql, function (err, result) {
    for (i = 0; i < result.length; i++) {
      let nomE = result[i].nombre;
      $('.prueba').append(function () {
        return ' <div class="caja"><label class="nombreequipo' + i + ' botonEq' + i + '" ></label></div>';
      });
      $('.nombreequipo' + i + '').html(nomE);
      $('.botonEq' + i + '').click(function () {
        infoE(nomE);
      })
    }
    if (err) throw err;
  });
}
onclick = "infoE('+nomE+')"

//Función para sacar la lista de jugadores dentro de un equipo seleccionado
function infoE(nomE) {
  console.log(nomE)
  var sql = "SELECT loluser FROM jugadores j JOIN equipos e ON " +
    "j.idjugador = e.idj1 OR " +
    "j.idjugador = e.idj2 OR " +
    "j.idjugador = e.idj3 OR " +
    "j.idjugador = e.idj4 OR " +
    "j.idjugador = e.idj5 OR " +
    "j.idjugador = e.idj6 OR " +
    "j.idjugador = e.idj7 WHERE e.nombre LIKE '" + nomE + "'";
  con.query(sql, function (err, result) {
    console.log(result);
    for (i = 0; i < result.length; i++) {
      $('.infoE').append(function () {
        return ' <label class="nombrejug' + i + '"></label><br>';
      });
      $('.nombrejug' + i + '').html(result[i].loluser);
    }
    if (err) throw err;
  });
}


function arrow(boolean) {

}
