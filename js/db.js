var mysql = require("mysql");

const ipc = require("electron").ipcRenderer;

var con = mysql.createConnection({
  host: "192.168.0.57",
  user: "ligaelite",
  password: "ligaelite",
  database: "formulario",
  multipleStatements: true
});

var onlineUsers = [];

function funcionesdb(num) {
  switch (num) {
    //Update cola1vs1 a 1 mientras un usuario busca rival
    case 1:
      updateColaInd();
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
      clasificacion();
      break;
    //Comprobar si al pulsar la imagen del lol el usuario está verificado o no
    case 4:
      comprobarLol();
      break;
    //Consultar los puntos de un jugador para mostrarlos en la interfaz
    case 5:
      consultarPuntos();
      break;
    //Guardar un nuevo usuario en la base de datos
    case 6:
      agregarUsuario();
      break;
    //Comprobar si los datos de login son correctos
    case 7:
      comprobarLogin();
      break;
    //Meter los usuarios online en un array
    case 8:
      checkOnline();
      break;
  }
}

//Revisar
//Update cola1vs1 a 1 mientras un usuario busca rival
function updateColaInd() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  var sql =
    "UPDATE jugadores SET colaind = 1 WHERE eliteuser LIKE '" +
    user.eliteuser +
    "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
  });
}

//Revisar
//Comprobar cada x tiempo la gente que está esperando rival en 1vs1 y emparejarlos
function matchMakingInd() {
  var njug = 0;
  var jug1,
    jug2 = "";
  var sql =
    "SELECT puntos, loluser FROM jugadores WHERE colaind=1 ORDER BY puntos";
  con.query(sql, function(err, result) {
    njug = result.length;
    if (njug % 2 != 0) {
      njug - 1;
    }
    for (i = 0; i < njug; i++) {
      jug1 = result[i].loluser;
      if (i != njug - 1) {
        i++;
        jug2 = result[i].loluser;
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
    var sql2 =
      "UPDATE jugadores SET colaind = 0 WHERE loluser LIKE '" + jug1 + "'";
    con.query(sql2, function(err, result) {
      if (err) throw err;
    });
    var sql3 =
      "UPDATE jugadores SET colaind = 0 WHERE loluser LIKE '" + jug2 + "'";
    con.query(sql3, function(err, result) {
      if (err) throw err;
    });
    var sql4 =
      "INSERT INTO 1vs1 (inv1, inv2) VALUES ('" + jug1 + "', '" + jug2 + "')";
    con.query(sql4, function(err, result) {
      if (err) throw err;
    });
  }
}

//Escoger a los jugadores con más puntos para ponerlos en la clasificación
function clasificacion() {
  let pag = parseInt(document.getElementById("tablita").value);
  let njug, pts, jug, centro, maxpag;
  let sql = "SELECT * FROM jugadores";
  con.query(sql, function(err, result) {
    njug = result.length;
    maxpag = njug / 7;
    if (njug % 7 != 0) {
      maxpag++;
    }
    if (pag <= maxpag) {
      query();
    } else {
      document.getElementById("tablita").value =
        parseInt(document.getElementById("tablita").value) - 1;
    }
    if (err) throw err;
  });

  //Consulta los jugadores de la página actual de la clasificación
  function query() {
    var sql2 =
      "SELECT * FROM jugadores ORDER BY puntos DESC, eliteuser LIMIT " +
      (pag - 1) * 7 +
      ", 7";
    con.query(sql2, function(err, result) {
      njug = result.length;
      $(".clas").empty();
      for (i = 0; i < njug; i++) {
        jug = result[i].eliteuser;
        pts = result[i].puntos;
        centro = result[i].centro;
        setValue2(jug, pts, centro, i);
      }
      if (err) throw err;
    });
  }

  //Crea las filas de la tabla de clasificación
  function setValue2(jug, pts, centro, i) {
    var sql3 = "SELECT nombre FROM centros WHERE id = " + centro + "";
    con.query(sql3, function(err, result) {
      $(".clas").append(function() {
        return (
          '<tr class="odd"><th scope="row">' +
          (i + (pag - 1) * 7 + 1) +
          "</th><td>" +
          jug +
          "</td><td>" +
          pts +
          "</td><td>" +
          result[0].nombre +
          "</td></tr>"
        );
      });
      if (err) throw err;
    });
  }
}

//Revisar
//Comprobar si el usuario actual ha validado su cuenta de lol
function comprobarLol() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  var sql =
    "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" +
    user.eliteuser +
    "'";
  con.query(sql, function(err, result) {
    console.log(result);
    var r = result[0].loluser;
    if (err) throw err;
    else {
      //No la tiene validada
      if (r == "" || r == null) {
        div_show();
        //La tiene validada
      } else {
        gotoindex();
      }
    }
  });
}

//Revisar
function addnom(loluser, elo) {
  console.log(loluser);
  let user = JSON.parse(localStorage.getItem("currentUser"));
  console.log(user.eliteuser);
  var sql =
    "UPDATE jugadores SET loluser = '" +
    loluser +
    "', elo = " +
    elo +
    " WHERE eliteuser LIKE '" +
    user.eliteuser +
    "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
    else {
      gotoindex();
      user = JSON.parse(localStorage.getItem("currentUser"));
      localStorage.setItem(
        "currentUser",
        JSON.stringify((user["loluser"] = loluser))
      );
    }
  });
}

//Revisar
//Sacar los puntos que tiene el usuario en su cuenta
function consultarPuntos() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  var sql =
    "SELECT puntos FROM jugadores WHERE eliteuser LIKE '" +
    user.eliteuser +
    "'";
  con.query(sql, function(err, result) {
    console.log(result);
    let puntos = result[0].puntos;
    console.log(puntos);
    $(".puntos").html(puntos);
    if (err) throw err;
  });
}

//Meter un nuevo usuario en la base de datos
function agregarUsuario() {
  var eliteu = document.getElementsByName("nombre")[0].value;
  var cen = document.getElementsByName("centro")[0].value;
  var contra = document.getElementsByName("contrasena")[0].value;
  var sql = "SELECT * FROM jugadores WHERE eliteuser = '" + eliteu + "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
    else {
      if (result == "" && contra != "") {
        var sql2 =
          "INSERT INTO jugadores (eliteuser, centro, contrasena) VALUES ('" +
          eliteu +
          "', '" +
          cen +
          "', '" +
          contra +
          "')";
        con.query(sql2, function(err, result) {
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
  let nombre = document.getElementById("nombre").value;
  let pass = document.getElementById("pass").value;
  let sql =
    "SELECT * FROM jugadores WHERE eliteuser LIKE '" +
    nombre +
    "' AND contrasena LIKE '" +
    pass +
    "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
    else {
      if (result == "") {
        alert("Usuario o contraseña erróneos");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(result[0]));
        conectarse();
        gotoinicio();
      }
    }
  });
}

//Hay que usarla en todos los unload postlogin
function conectarse() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let miid = user.idjugador;
  sql = "INSERT INTO gente_online (id, fecha) VALUES (" + miid + ", NOW())";
  con.query(sql, function(err, result) {
    if (err) throw err;
  });
  ipc.send("user-logueado", miid);
}

//Buscar el rival más cercano en puntos
function buscarRival() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let puntos1 = 0;
  let puntos2 = 0;
  let nombrelol2 = 0;
  var sql =
    "SELECT puntos, loluser FROM jugadores WHERE eliteuser LIKE '" +
    user.eliteuser +
    "'";
  con.query(sql, function(err, result) {
    console.log(result);
    puntos1 = result[0].puntos;
    $(".nombre").html(result[0].loluser);
    $(".puntos").html(result[0].puntos);
    setInterval(setValue3(puntos1, result[0].loluser), 1000);
    if (err) throw err;
  });

  //Solucionar que cuando no haya ninguno con menos puntos vaya al siguiente por arriba
  //Si tampoco hay más por arriba y está sólo que se quede buscando
  //Y que los que encuentre, hacer como en matchmakingind y que me ponga sus colaind a 0
  //Matchmakingind está comentada ahora mismo
  function setValue3(punto, nelite) {
    var sql2 =
      "SELECT puntos, loluser FROM jugadores WHERE colaind=1 AND puntos <=" +
      punto +
      " AND loluser != '" +
      nelite +
      "' ORDER BY puntos DESC LIMIT 1";
    con.query(sql2, function(err, result) {
      console.log(result);
      nombrelol2 = result[0].loluser;
      puntos2 = result[0].puntos;
      $(".nombre2").html(nombrelol2);
      $(".puntos2").html(puntos2);
      if (err) throw err;
    });
  }
}

//Función para sacar la lista de equipos
function listaE() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let id = user.idjugador;
  var sql =
    "SELECT nombre FROM equipos WHERE idj1= " +
    id +
    " OR idj2= " +
    id +
    " OR idj3= " +
    id +
    " OR idj4= " +
    id +
    " OR idj5= " +
    id +
    " OR idj6= " +
    id +
    " OR idj7= " +
    id +
    "";
  con.query(sql, function(err, result) {
    for (i = 0; i < result.length; i++) {
      let nomE = result[i].nombre;
      $(".prueba").append(function() {
        return (
          ' <div class="caja"><label class="nombreequipo' +
          i +
          " botonEq" +
          i +
          '" ></label></div>'
        );
      });
      $(".nombreequipo" + i + "").html(nomE);
      $(".botonEq" + i + "").click(function() {
        infoE(nomE);
      });
    }
    if (err) throw err;
  });
}

//Función para sacar la lista de jugadores de un equipo seleccionado
function infoE(nomE) {
  console.log(nomE);
  var sql =
    "SELECT loluser FROM jugadores j JOIN equipos e ON " +
    "j.idjugador = e.idj1 OR " +
    "j.idjugador = e.idj2 OR " +
    "j.idjugador = e.idj3 OR " +
    "j.idjugador = e.idj4 OR " +
    "j.idjugador = e.idj5 OR " +
    "j.idjugador = e.idj6 OR " +
    "j.idjugador = e.idj7 WHERE e.nombre LIKE '" +
    nomE +
    "'";
  con.query(sql, function(err, result) {
    console.log(result);
    let tamE = result.length;
    $(".infoE").empty();
    for (i = 0; i < result.length; i++) {
      $(".infoE").append(function() {
        return ' <label class="nombrejug' + i + '"></label><br>';
      });
      $(".nombrejug" + i + "").html(result[i].loluser);
    }
    if (err) throw err;
    compAñaJug(nomE, tamE);
  });
}

//Funciones para crear un equipo
function crearE1() {
  let cont = 0;
  let nombreE = document.getElementById("nombreE").value;
  sql = "SELECT nombre FROM equipos";
  con.query(sql, function(err, result) {
    for (i = 0; i < result.length; i++) {
      if (nombreE != result[i].nombre) {
      } else {
        cont++;
      }
    }
    if (cont == 0) {
      crearE2(nombreE);
    } else {
      alert("Nombre ya existente");
    }
    if (err) throw err;
  });
}

function crearE2(nomE) {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let id = user.idjugador;
  console.log(nomE);
  console.log(id);

  sql2 =
    "INSERT INTO equipos (nombre, idj1) VALUES ('" + nomE + "' , " + id + ")";
  con.query(sql2, function(err, result) {
    if (err) throw err;
  });
}
1;

//Función para añadir jugador a los equipos
function compAñaJug(nomE, tamE) {
  nomEq = nomE;
  tamEq = tamE;
  var sql =
    "SELECT idj1, idj2, idj3, idj4, idj5, idj6, idj7 FROM equipos where nombre = '" +
    nomEq +
    "'";
  con.query(sql, function(err, result) {
    console.log(result);
    if (result[0].idj2 == null) {
      $(".infoE").append(function() {
        return (
          ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
          '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
        );
      });
    } else if (result[0].idj3 == null) {
      $(".infoE").append(function() {
        return (
          ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
          '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
        );
      });
    } else if (result[0].idj4 == null) {
      $(".infoE").append(function() {
        return (
          ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
          '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
        );
      });
    } else if (result[0].idj5 == null) {
      $(".infoE").append(function() {
        return (
          ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
          '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
        );
      });
    } else if (result[0].idj6 == null) {
      $(".infoE").append(function() {
        return (
          ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
          '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
        );
      });
    } else if (result[0].idj7 == null) {
      $(".infoE").append(function() {
        return (
          ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
          '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
        );
      });
    }
    if (err) throw err;
  });
}

//Funciones para buscar a un jugador e invitarlo a un equipo
//Esta comprueba si el jugador de LoL existe en la base de datos
function busqC(nomEq, tamEq) {
  let nomNJ = document.getElementById("busqC").value;
  nomEqu = nomEq;
  tamEqu = tamEq;
  sql = "SELECT idjugador FROM jugadores WHERE loluser='" + nomNJ + "'";
  con.query(sql, function(err, result) {
    if (result.length == 0) {
      alert(
        "El nombre de usuario no existe o quizás no se haya registrado en la app"
      );
    } else {
      busqC2(result[0].idjugador, nomEqu, tamEqu);
    }
    if (err) throw err;
  });
}

//esta comprueba que no esté ese jugador ya en el equipo y sino llama a la función que lo mete
function busqC2(idj, nomEqu, tamEqu) {
  idjug = idj;
  tamEquipo = tamEqu;
  nomEquipo = nomEqu;
  sql =
    "SELECT idj1, idj2, idj3, idj4, idj5, idj6, idj7 FROM equipos where nombre = '" +
    nomEquipo +
    "'";
  con.query(sql, function(err, result) {
    if (
      idjug == result[0].idj1 ||
      idjug == result[0].idj2 ||
      idjug == result[0].idj3 ||
      idjug == result[0].idj4 ||
      idjug == result[0].idj5 ||
      idjug == result[0].idj6 ||
      idjug == result[0].idj7
    ) {
      alert("Ese jugador ya se encuentra en el equipo");
    } else {
      busqC3(idjug, nomEquipo, tamEquipo);
    }
  });
}

//Esta función introduce el jugador en el equipo
function busqC3(idjug, nomEquipo, tamEquipo) {
  tamEquipo = tamEquipo + 1;
  sql =
    "UPDATE equipos SET idj" +
    tamEquipo +
    "= " +
    idjug +
    " WHERE nombre LIKE '" +
    nomEquipo +
    "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
  });
}

//Meter los usuarios online en un array
//Añadido en la función mostrarNombre de funciones.js
function checkOnline() {
  var aux = [];
  sql = "SELECT id FROM gente_online";
  con.query(sql, function(err, result) {
    for (let i = 0; i < result.length; i++) {
      onlineUsers[i] = result[i];
    }
    miraAC();
    if (err) throw err;
  });
}

//Función que te comprueba la lista de los amigos conectados para luego llamar a la función que los muestra
function miraAC() {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let id = user.idjugador;
  let long1 = 0;
  let long2 = 0;
  sql = "SELECT id_p FROM amigos WHERE id_r= " + id + "";
  con.query(sql, function(err, result) {
    if (result.length == 0) {
    } else {
      for (let i = 0; i < result.length; i++) {
        onlineUsers[i] = result[i].id_p;
        long1 = result.length;
      }
      if (err) throw err;
    }
  });

  sql2 = "SELECT id_r FROM amigos WHERE id_p= " + id + "";
  con.query(sql2, function(err, result) {
    if (result.length == 0) {
    } else {
      for (let i = 0; i < result.length; i++) {
        onlineUsers[i + long1] = result[i].id_r;
        long2 = result.length + long1;
      }
      mostrarA(onlineUsers, long2);
      if (err) throw err;
    }
  });
}

//Función que se encarga de mostrar la lista de amigos conectados para el chat
function mostrarA(lista, longitud) {
  for (let i = 0; i < longitud; i++) {
    sql = "SELECT eliteuser FROM jugadores WHERE idjugador=" + lista[i] + "";
    con.query(sql, function(err, result) {
      $(".chat-sidebar").append(function() {
        return (
          '<div id="sidebar-user-box" class="' + lista[i] +'"><img id="img-icono" src="../img/elite.png"/>' +
          '<span id="slider-username">' +
          result[0].eliteuser +
          "</span></div>"
        );
      });

      if (err) throw err;
    });
  }
}

/* module.exports = function alCerrar(){
  sql = "INSERT INTO gente_online (id, fecha) VALUES (9999, '1900/01/01 00:00:00')"
  con.query(sql, function (err, result) {
    if (err) throw err;
  })
} */

/* const alCerrar = () => {
  sql = "INSERT INTO gente_online (id, fecha) VALUES (9999, '1900/01/01 00:00:00')"
  con.query(sql, function (err, result) {
    if (err) throw err;
  })
}

module.exports = {
  alCerrar: alCerrar
} */

//Mandar mensajes del chatbox que abra
function mandarMensajes(userID, msg) {
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let miid = user.idjugador;
  sql =
    "INSERT INTO mensajes (emisor, receptor, mensaje, hora) VALUES (" +
    miid +
    ", " +
    userID +
    ', "' +
    msg +
    '", NOW())';
  con.query(sql, function(err, result) {
    if (err) throw err;
  });
}

//Recibir mensajes del chatbox que abra
function recibirMensajes(username) {
  let miid = JSON.parse(localStorage.getItem("currentUser").idjugador);
  let suid;

  sql = "SELECT id FROM jugadores WHERE eliteuser LIKE '" + username + "'";
  con.query(sql, function(err, result) {
    if (err) throw err;
  });
}
