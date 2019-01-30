var mysql = require("mysql");

//Hay que mirar como cargar la conexión desde el main
var con = mysql.createConnection({
    host: "192.168.0.57",
    user: "ligaelite",
    password: "ligaelite",
    database: "formulario",
    multipleStatements: true
});

var onlineUsers = [];

ipc.on('iniciodb', function (event) {
    comprobarLol()
})

ipc.on('iniciodb2', function (event) {
    addAmigo()
})

ipc.on('iniciodb4', function (event) {
    checkOnline()
})

ipc.on('iniciodb5', function (event, arg) {
    recibirMensajes(arg)
})

ipc.on('iniciodb7', function (event, arg1, arg2) {
    recibirMensajes2(arg1, arg2)
})

ipc.on('iniciodb8', function (event, arg1, arg2) {
    mandarMensajes(arg1, arg2)
})
//
function comprobarLol() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    var sql =
        "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" +
        user.eliteuser + "'";
    con.query(sql, function (err, result) {
        console.log(result);
        var r = result[0].loluser;
        if (err) throw err;
        else {
            //No la tiene validada
            if (r == "" || r == null) {
                ipc.send('iniciodb3')
                //La tiene validada
            } else {
                gotoindex();
            }
        }
    });
}

//Funciones para buscar un jugador y añadirlo a tus amigos
//Esta comprueba si el
function addAmigo() {
    let nomAmigo = document.getElementById("search").value;
    sql = "SELECT idjugador FROM jugadores WHERE eliteuser='" + nomAmigo + "'";
    con.query(sql, function (err, result) {
        if (result.length == 0) {
            alert(
                "El nombre de usuario no existe o quizás no se haya registrado en la app"
            );
        } else {
            addAmigo2(result[0].idjugador);
        }

        if (err) throw err;
    });
}

//Función para comprobar que no es ya tu amigo
function addAmigo2(idj) {
    idamigo = idj;
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    sql =
        "SELECT id FROM amigos WHERE (id_p= " + idamigo + " AND id_r= " + id + ") OR (id_r= " + idamigo + " AND id_p= " + id + ")";
    con.query(sql, function (err, result) {
        if (result.length > 0) {
            alert("El usuario ya es tu amigo");
        } else {
            addAmigo3(idamigo, id);
        }
        if (err) throw err;
    });

    /* sql2 =
      "SELECT id FROM amigos WHERE id_r= " + idamigo + " AND id_p= " + id + "";
    con.query(sql2, function(err, result) {
      if (result.length > 0) {
        console.log(result);
        console.log("adfsf");
        cont++;
      } else {
      }
      if (err) throw err;
    });
    console.log(cont)
    if (cont > 0) {
      alert("El usuario ya es tu amigo");
    } else {
      addAmigo3(idamigo, id);
    } */
}

//Último función de addAmigo para insertar la fila en la tabla amigos
function addAmigo3(ida, idu) {
    idamigo = ida;
    iduser = idu;
    sql =
        "INSERT INTO amigos (id_p, id_r, estado) VALUES (" +
        iduser +
        ", " +
        idamigo +
        ", 1)";
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}

//Meter los usuarios online en un array
//Añadido en la función mostrarNombre de funciones.js
function checkOnline() {
    var aux = [];
    sql = "SELECT id FROM gente_online";
    con.query(sql, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            onlineUsers[i] = result[i];
        }
        miraAC();
        if (err) throw err;
    });
}

//Función que te comprueba la lista de los amigos para luego llamar a la función que los muestra
function miraAC() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    let long1 = 0;
    let long2 = 0;
    sql = "SELECT id_p FROM amigos WHERE id_r= " + id + "";
    con.query(sql, function (err, result) {
        if (result.length == 0) {} else {
            for (let i = 0; i < result.length; i++) {
                onlineUsers[i] = result[i].id_p;
                long1 = result.length;
            }
            if (err) throw err;
        }
    });

    sql2 = "SELECT id_r FROM amigos WHERE id_p= " + id + "";
    con.query(sql2, function (err, result) {
        if (result.length == 0) {} else {
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
        con.query(sql, function (err, result) {
            $(".chat-sidebar").append(function () {
                return (
                    '<div id="sidebar-user-box" class="' +
                    lista[i] +
                    '"><img id="img-icono" src="../img/elite.png"/>' +
                    '<span id="slider-username">' +
                    result[0].eliteuser +
                    "</span></div>"
                );
            });

            if (err) throw err;
        });
    }
}

//Recibir mensajes del chatbox que abra
function recibirMensajes(username) {
    let miid = JSON.parse(localStorage.getItem("currentUser"));
    miid = miid.idjugador;
    sql =
        "SELECT mensaje, emisor FROM mensajes WHERE (emisor = " +
        miid +
        " AND receptor = " +
        username +
        ") OR (emisor = " +
        username +
        " AND receptor = " +
        miid +
        ")";
    con.query(sql, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            if (result[i].emisor == miid) {
                ipc.send('iniciodb6', result[i].mensaje, username, true)
            } else {
                ipc.send('iniciodb6', result[i].mensaje, username, false)
            }
        }
        if (err) throw err;
    });
}

function recibirMensajes2(time, username) {
    let miid = JSON.parse(localStorage.getItem("currentUser"));
    miid = miid.idjugador;
    sql =
        "SELECT mensaje, emisor FROM mensajes WHERE emisor = " +
        username +
        " AND receptor = " +
        miid +
        " AND hora > '" +
        time +
        "'";
    con.query(sql, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            mensaje(result[i].mensaje, username, false);
            d = result[i].hora;
            if (err) throw err;
        }
    });
}

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
    if (msg != null) {
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
    }
}