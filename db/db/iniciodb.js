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

ipc.on('addamigo', function (event) {
    addAmigo()
})

ipc.on('loadmessages', function (event, arg) {
    cargarMensajes(arg)
})

ipc.on('actualizarmsg', function (event, arg) {
    actualizarMensajes(arg)
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

//Miro si el jugador escrito existe para añadirlo a amigos
function addAmigo() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    let nomAmigo = document.getElementById("search").value;
    if(nomAmigo == user.eliteuser){
        alert('No te puedes agregar a ti mismo')
        return
    }
    let sql = "SELECT idjugador FROM jugadores WHERE eliteuser='" + nomAmigo + "'";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                alert("El nombre de usuario no existe");
            } else {
                //Compruebo si ya son amigos
                let sql2 = `SELECT idjugador FROM jugadores WHERE idjugador IN 
                (select id_p from amigos where id_p=` + result[0].idjugador + ` && id_r=` + id + ` && estado=1)
                 OR idjugador IN (select id_r from amigos where id_r=` + result[0].idjugador + ` && id_p=` + id + ` && estado=1)`
                mysqlcon.getConnection(function (err, con) {
                    con.query(sql2, function (err, result2) {
                        if (err) throw err;
                        if (result2.length == 0) {
                            //Inserto que ya son amigos
                            let sql3 = "INSERT INTO amigos (id_p, id_r, estado) VALUES (" + id + ", " +
                                result[0].idjugador + ", 1)"
                            mysqlcon.getConnection(function (err, con) {
                                con.query(sql3, function (err, result3) {
                                    if (err) throw err;
                                    $(".chat-sidebar").empty()
                                    miraAmigosConectados()
                                });
                                con.release();
                            });
                        } else {
                            alert('Error, ya sois amigos')
                        }
                    });
                    con.release();
                });
            }
        });
        con.release();
    });
}

//Miro si el jugador escrito existe para borrarlo de amigos
function borrarAmigo() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    let nomAmigo = document.getElementById("search2").value;
    if(nomAmigo == user.eliteuser){
        alert('No te puedes borrar a ti mismo')
        return
    }
    let sql = "SELECT idjugador FROM jugadores WHERE eliteuser='" + nomAmigo + "'";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                alert("El nombre de usuario no existe");
            } else {
                //Compruebo si ya son amigos
                let sql2 = `SELECT idjugador FROM jugadores WHERE idjugador IN 
                (select id_p from amigos where id_p=` + result[0].idjugador + ` && id_r=` + id + ` && estado=1)
                 OR idjugador IN (select id_r from amigos where id_r=` + result[0].idjugador + ` && id_p=` + id + ` && estado=1)`
                mysqlcon.getConnection(function (err, con) {
                    con.query(sql2, function (err, result2) {
                        if (err) throw err;
                        if (result2.length == 1) {
                            //Borro de la columna amigos esa amistad
                            let sql3 = `DELETE FROM amigos WHERE (id_r = ` + result[0].idjugador + ` && id_p = ` +
                                id + `) OR (id_p = ` + result[0].idjugador + ` && id_r = ` + id + `)`
                            mysqlcon.getConnection(function (err, con) {
                                con.query(sql3, function (err, result3) {
                                    if (err) throw err;
                                    $(".chat-sidebar").empty()
                                    miraAmigosConectados()
                                });
                                con.release();
                            });
                        } else {
                            alert('Error, no sois amigos')
                        }
                    });
                    con.release();
                });
            }
        });
        con.release();
    });
}

//Función que te comprueba la lista de los amigos
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
                    amigos.push(result[i].eliteuser + "-9-9-" + result[i].idjugador + "_1_" + result[i].img)
                }
                limit = result.length;
            }
            let sql2 = "SELECT eliteuser, idjugador, img FROM jugadores WHERE idjugador IN (SELECT id_r FROM amigos WHERE id_p= " +
                id + ")"
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
                    $(".chat-sidebar").append(
                        `<input type="text" id="search" placeholder="Añadir amigo" style="width: 80%">
                        <button id="amigos" style="width:25px">&#10004</button>`
                    )
                    let btnamigos = document.getElementById('amigos')
                    btnamigos.addEventListener('click', addAmigo)
                    for (let i = 0; i < amigos.length; i++) {
                        split = amigos[i].split("-9-9-");
                        split2 = split[1].split("_1_");
                        //Cargo la imagen de perfil del usuario para su icono de chat
                        if (err) throw err;
                        $(".chat-sidebar").append(function () {
                            return (
                                '<div id="sidebar-user-box" class="' + split2[0] +
                                '"><img id="img-icono" src="' + split2[1] + '"/>' +
                                '<span id="slider-username">' + split[0] +
                                '</span></div>'
                            );
                        });
                    }
                    $(".chat-sidebar").append(
                        `<input type="text" id="search2" placeholder="Eliminar amigo" style="width: 80%">
                        <button id="delete" style="width:25px">X</button>`
                    )
                    let btndelete = document.getElementById('delete')
                    btndelete.addEventListener('click', borrarAmigo)
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