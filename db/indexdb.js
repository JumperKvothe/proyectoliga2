var mysql = require("mysql");
var con, iduserLogueado

function conexion(datos) {
    con = mysql.createConnection({
        host: datos[0],
        user: datos[1],
        password: datos[2],
        database: datos[3],
        multipleStatements: datos[4]
    });
}

ipc.on('logoutdb', function (event, arg) {
    conexion(arg.conex)
    iduserLogueado = arg.iduserLogueado
    logoutdb(arg.bool)
})

function logoutdb(bool) {
    if (iduserLogueado != null) {
        sql = "DELETE FROM gente_online WHERE id = " + iduserLogueado;
        con.query(sql, function (err, result) {
            con = null
            if (err) throw err;
            iduserLogueado = null
            if(bool){
                ipc.send('desconectado')
            }
        })
    }
}

//Meter los usuarios online en un array
function checkOnline() {
    sql = "SELECT id FROM gente_online";
    con.query(sql, function (err, result) {
        con = null
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            onlineUsers[i] = result[i];
        }
    });
}

