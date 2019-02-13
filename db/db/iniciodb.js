var mysql = require("mysql");
var con, cone
var onlineUsers = [];

function conexion(datos) {
    con = mysql.createConnection({
        host: datos[0],
        user: datos[1],
        password: datos[2],
        database: datos[3],
        multipleStatements: datos[4]
    });
}

function conexion2(datos) {
    con2 = mysql.createConnection({
        host: datos[0],
        user: datos[1],
        password: datos[2],
        database: datos[3],
        multipleStatements: datos[4]
    });
}

ipc.on('amigosdb', function (event, arg) {
    conexion(arg)
    miraAmigosConectados();
})

ipc.on('loldb', function (event, arg) {
    conexion(arg)
    comprobarLol()
})

ipc.on('sendmessages', function (event, arg0, arg1, arg2) {
    conexion(arg0)
    mandarMensajes(arg1, arg2)
})

ipc.on('iniciodb2', function (event) {
    //addAmigo()
})

ipc.on('loadmessages', function (event, arg1, arg2) {
    conexion(arg1)
    cargarMensajes(arg2)
})

ipc.on('actualizarmsg', function (event, arg1, arg2) {
    conexion2(arg1)
    actualizarMensajes(arg2)
})

//
function comprobarLol() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    var sql =
        "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" +
        user.eliteuser + "'";
    con.query(sql, function (err, result) {

        var r = result[0].loluser;
        if (err) throw err;
        else {
            if (r == "" || r == null) {
                //No la tiene validada
                ipc.send('iniciodb-notlol-to-js')
            } else {
                //La tiene validada
                goToLolIndex()
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

//Función que te comprueba la lista de los amigos
function miraAmigosConectados() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    let amigos = [];
    sql = "SELECT eliteuser, idjugador FROM jugadores WHERE idjugador IN (SELECT id_p FROM amigos WHERE id_r= " + id + ")"
    con.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {} else {
            for (let i = 0; i < result.length; i++) {
                amigos.push(result[i].eliteuser + "-9-9-" + result[i].idjugador)
            }
            limit = result.length;
        }
        sql2 = "SELECT eliteuser, idjugador FROM jugadores WHERE idjugador IN (SELECT id_r FROM amigos WHERE id_p= " + id + ")"
        con.query(sql2, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {} else {
                for (let i = 0; i < result.length; i++) {
                    amigos.push(result[i].eliteuser + "-9-9-" + result[i].idjugador)
                }
            }
            amigos.sort();
            let split
            //Durante este bucle hago aparecer los amigos en la lista
            for (let i = 0; i < amigos.length; i++) {
                split = amigos[i].split("-9-9-");
                $(".chat-sidebar").append(function () {
                    return (
                        '<div id="sidebar-user-box" class="' + split[1] + '"><img id="img-icono" src="../img/elite.png"/>' +
                        '<span id="slider-username">' + split[0] + "</span></div>"
                    );
                });
            }
            ipc.send('iniciodb-chatlisteners-to-js')
        });
    });
}

//Recibir mensajes del chatbox que abra
function cargarMensajes(username) {
    let miid = JSON.parse(localStorage.getItem("currentUser"));
    miid = miid.idjugador;
    let idarray = []
    let allid
    sql = "SELECT id, mensaje, emisor FROM mensajes WHERE (emisor = " + miid + " AND receptor = " + username + ") OR (emisor = " +
        username + " AND receptor = " + miid + ")";
    con.query(sql, function (err, result) {
        for (let i = 0; i < result.length; i++) {
            idarray.push(result[i].id)
            if (result[i].emisor == miid) {
                ipc.send('iniciodb-mensajes-to-js', result[i].mensaje, username, true)
            } else {
                ipc.send('iniciodb-mensajes-to-js', result[i].mensaje, username, false)
            }
        }
        allid = idarray.join(",")
        sql2 = "UPDATE mensajes SET leido = 1 WHERE receptor = " + miid + " && leido = 0 && id IN (" + allid + ")"
        con.query(sql2, function (err, result) {
            if (err) throw err;
            con = null;
        })
    });
}

function actualizarMensajes(userid) {
    let miid = JSON.parse(localStorage.getItem("currentUser"));
    miid = miid.idjugador;
    let idarray = []
    let allid
    sql = "SELECT id, mensaje FROM mensajes WHERE emisor = " + userid + " AND receptor = " + miid + " AND leido = 0"
    con2.query(sql, function (err, result) {
        if (err) return
        if (!err) {
            for (let i = 0; i < result.length; i++) {
                idarray.push(result[i].id)
                ipc.send('iniciodb-mensajes-to-js', result[i].mensaje, userid, false)
            }
            if (idarray.length != 0) {
                allid = idarray.join(",")
                sql2 = "UPDATE mensajes SET leido = 1 WHERE id IN (" + allid + ")"
                con2.query(sql2, function (err, result) {
                    if (err) throw err;
                    con2 = null;
                })
            }else{
                con2 = null;
            }
            
        }

    });
}

//Mandar mensajes cada vez que se de al intro en el input de un chat
function mandarMensajes(userID, msg) {
    console.log('12345')
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let miid = user.idjugador;
    sql = "INSERT INTO mensajes (emisor, receptor, mensaje, hora) VALUES (" + miid + ", " + userID + ', "' + msg + '", NOW())';
    con.query(sql, function (err, result) {
        if (err) throw err;
        con = null
    });

}