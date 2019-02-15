const ipc = require('electron').ipcRenderer;
const mysqlcon = require('./conexion')
var iduserLogueado

ipc.on('logoutdb', function (event, arg) {
    iduserLogueado = arg.iduserLogueado
    logoutdb(arg.bool)
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