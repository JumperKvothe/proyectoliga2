const mysqlcon = require('../conexion')

ipc.on('amigosdb', function (event) {
    miraAmigosConectados();
})

ipc.on('loldb', function (event) {
    comprobarLol()
})

ipc.on('sendmessages', function (event, arg1, arg2) {
    mandarMensajes(arg1, arg2)
})

ipc.on('iniciodb2', function (event) {
    addAmigo()
})

ipc.on('loadmessages', function (event, arg) {
    cargarMensajes(arg)
})

ipc.on('actualizarmsg', function (event, arg) {
    actualizarMensajes(arg)
})

ipc.on('mostrarPanel', function (event) {
    mostrarPanel()
})

//Comprueba si el usuario tiene cuenta de lol para mostrar el popup para insertarla o ir al lolindex
function comprobarLol() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    var sql = "SELECT loluser FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'";
    mysqlcon.getConnection(function (err, con) {
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
        con.release();
    });
}

//Funciones para buscar un jugador y añadirlo a tus amigos
//Esta comprueba si el
function addAmigo() {
    let nomAmigo = document.getElementById("search").value;
    sql = "SELECT idjugador FROM jugadores WHERE eliteuser='" + nomAmigo + "'";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (result.length == 0) {
                alert(
                    "El nombre de usuario no existe o quizás no se haya registrado en la app"
                );
            } else {
                //addAmigo2(result[0].idjugador);
            }

            if (err) throw err;
        });
        con.release();
    });
}

//Función para comprobar que no es ya tu amigo
function addAmigo2(idj) {
    idamigo = idj;
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    sql = "SELECT id FROM amigos WHERE (id_p= " + idamigo + " AND id_r= " + id + ") OR (id_r= " + idamigo +
        " AND id_p= " + id + ")";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (result.length > 0) {
                alert("El usuario ya es tu amigo");
            } else {
                //addAmigo3(idamigo, id);
            }
            if (err) throw err;
        });
        con.release();
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
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        con.release();
    });
}

//Función que te comprueba la lista de los amigos
//
//
//
function miraAmigosConectados() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    let amigos = [];
    let sql = "SELECT eliteuser, idjugador, img FROM jugadores WHERE idjugador IN (SELECT id_p FROM amigos WHERE id_r= " + id + ")"
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {} else {
                for (let i = 0; i < result.length; i++) {
                    console.log(result.length)
                    amigos.push(result[i].eliteuser + "-9-9-" + result[i].idjugador + "_1_" + result[i].img)
                }
                limit = result.length;
            }
            let sql2 = "SELECT eliteuser, idjugador, img FROM jugadores WHERE idjugador IN (SELECT id_r FROM amigos WHERE id_p= "
             + id + ")"
            mysqlcon.getConnection(function (err, con) {
                con.query(sql2, function (err, result2) {
                    if (err) throw err;
                    if (result2.length == 0) {} else {
                        for (let i = 0; i < result2.length; i++) {
                            amigos.push(result2[i].eliteuser + "-9-9-" + result2[i].idjugador + "_1_" + result2[i].img)
                        }
                    }
                    amigos.sort();
                    let split, split2
                    //Durante este bucle hago aparecer los amigos en la lista
                    //Con split separo los 3 elementos de los strings de mi array amigos
                    for (let i = 0; i < amigos.length; i++) {
                        split = amigos[i].split("-9-9-");
                        split2 = split[1].split("_1_");
                        //Cargo la imagen de perfil del usuario para su icono de chat
                        if (err) throw err;
                        $(".chat-sidebar").append(function () {
                            return (
                                '<div id="sidebar-user-box" class="' + split2[0] +
                                '"><img id="img-icono" src="' + split2[1] + '"/>' +
                                '<span id="slider-username">' + split[0] + "</span></div>"
                            );
                        });
                    }
                    ipc.send('iniciodb-chatlisteners-to-js')
                });
                con.release();
            });
        });
        con.release();
    });
}

//Recibir mensajes del chatbox que abra
function cargarMensajes(username) {
    let miid = JSON.parse(localStorage.getItem("currentUser"));
    miid = miid.idjugador;
    let idarray = []
    let allid
    sql = "SELECT id, mensaje, emisor FROM mensajes WHERE (emisor = " + miid +
        " AND receptor = " + username + ") OR (emisor = " + username + " AND receptor = " + miid + ")";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                idarray.push(result[i].id)
                if (result[i].emisor == miid) {
                    ipc.send('iniciodb-mensajes-to-js', result[i].mensaje, username, true)
                } else {
                    ipc.send('iniciodb-mensajes-to-js', result[i].mensaje, username, false)
                }
            }
            if (result.length != 0) {
                allid = idarray.join(",")
                sql2 = "UPDATE mensajes SET leido = 1 WHERE receptor = " + miid + " && leido = 0 && id IN (" + allid + ")"
                mysqlcon.getConnection(function (err, con) {
                    con.query(sql2, function (err, result) {
                        if (err) throw err;
                    });
                    con.release();
                });
            }
        });
        con.release();
    });
}

async function actualizarMensajes(userid) {
    let miid = JSON.parse(localStorage.getItem("currentUser"));
    miid = miid.idjugador;
    let idarray = []
    let allid
    sql = "SELECT id, mensaje FROM mensajes WHERE emisor = " + userid + " AND receptor = " + miid + " AND leido = 0"
    await mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) {
                return
            } else {
                for (let i = 0; i < result.length; i++) {
                    idarray.push(result[i].id)
                    ipc.send('iniciodb-mensajes-to-js', result[i].mensaje, userid, false)
                }
                if (idarray.length != 0) {
                    allid = idarray.join(",")
                    sql2 = "UPDATE mensajes SET leido = 1 WHERE id IN (" + allid + ")"
                    mysqlcon.getConnection(function (err, con) {
                        con.query(sql2, function (err, result) {
                            if (err) throw err;
                        });
                        con.release();
                    });
                }
            }
        });
        con.release();
    });
}

//Mandar mensajes cada vez que se de al intro en el input de un chat
function mandarMensajes(userID, msg) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let miid = user.idjugador;
    sql = "INSERT INTO mensajes (emisor, receptor, mensaje, hora) VALUES (" +
        miid + ", " + userID + ', "' + msg + '", NOW())';
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
        });
        con.release();
    });
}

//Si el usuario logueado es admin le aparecerá el botón en la barra de navegación para ir a la página panel.html
function mostrarPanel() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let miid = user.idjugador;
    sql = "SELECT * FROM jugadores WHERE idjugador = " + miid + " AND admin = 1"
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 1) {
                $('#ulnav').prepend('<li><a id="panel">Panel</a></li>')
                $(document).on('click', '#panel', function(){
                    window.location.href = "../html/panel.html"
                });
            }
        });
        con.release();
    });
}