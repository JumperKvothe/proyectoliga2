var CryptoJS = require("crypto-js")
const mysqlcon = require('../conexion')

ipc.on('changepass', function (event) {
    cambiarPass()
})

ipc.on('changecentro', function (event) {
    cambiarCentro()
})

ipc.on('cambiarimagen', function (event) {
    cargarImagen()
})

//Cambiar la contraseña desde el perfil
function cambiarPass() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let oldpass = document.getElementById('oldpass').value
    let newpass1 = document.getElementById('newpass1').value
    let sql = "SELECT * FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            let bytes = CryptoJS.AES.decrypt(result[0].contrasena, 'SvQ');
            let decpass = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if (oldpass == decpass) {
                let encpass = CryptoJS.AES.encrypt(newpass1, 'SvQ').toString();
                let sql2 = "UPDATE jugadores SET contrasena = '" + encpass +
                    "' WHERE eliteuser = '" + user.eliteuser + "'"
                mysqlcon.getConnection(function (err, con) {
                    con.query(sql2, function (err, result) {
                        if (err) throw err;
                        else {
                            alert('Contraseña cambiada correctamente')
                        }
                    });
                    con.release();
                });
            } else {
                alert('Has introducido mal tu contraseña')
            }
        });
        con.release();
    });
}

//Cambiar el centro desde el perfil
function cambiarCentro() {
    let centron = document.getElementById('centro').value
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let sql = "SELECT centro FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'"
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result[0].centro == centron) {
                alert('Ese ya es tu centro')
            } else {
                sql2 = "UPDATE jugadores SET centro = '" + centron + "' WHERE eliteuser = '" +
                    user.eliteuser + "'"
                mysqlcon.getConnection(function (err, con) {
                    con.query(sql2, function (err, result) {
                        if (err) throw err;
                        else {
                            alert('Centro cambiado correctamente')
                        }
                    });
                    con.release();
                });
            }
        });
        con.release();
    });

}

//Cargar la imagen de perfil del usuario
function cargarImagen() {
    let img = document.getElementById('img')
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let sql = "SELECT img FROM jugadores WHERE eliteuser LIKE '" + user.eliteuser + "'"
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            img.src = result[0].img
        });
        con.release();
    });
}