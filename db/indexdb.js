const ipc = require('electron').ipcRenderer;
const mysqlcon = require('./conexion')
var iduserLogueado

ipc.on('logoutdb', function (event, arg) {
    iduserLogueado = arg.iduserLogueado
    logoutdb(arg.bool)
})

ipc.on('mostrarPanel', function (event) {
    mostrarPanel()
})

//Desconectamos al usuario logueado de la tabla gente_online
function logoutdb(bool) {
    if (iduserLogueado != null) {
        sql = "DELETE FROM gente_online WHERE id = " + iduserLogueado;
        mysqlcon.getConnection(function (err, con) {
            con.query(sql, function (err, result) {
                con = null
                if (err) throw err;
                iduserLogueado = null
                if (bool) {
                    ipc.send('desconectado')
                }
            });
        });
    }
}

//Meter los usuarios online en un array
function checkOnline() {
    sql = "SELECT id FROM gente_online";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            con = null
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                onlineUsers[i] = result[i];
            }
        });
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