const mysqlcon = require('../conexion')

ipc.on('showPage', function (event) {
    showPage()
})

//Al cargar la página se comprueba si el que ha entrado es admin para mostrar el body (sino solo se muestra la barra de navegación)
function showPage() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let miid = user.idjugador;
    sql = "SELECT * FROM jugadores WHERE idjugador = " + miid + " AND admin = 1"
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            if (result.length == 1) {
                //Saco todos los usuarios menos el actual para meterlos en una tabla
                sql2 = "SELECT J.*, nombre FROM jugadores J JOIN centros C ON J.centro = C.id WHERE NOT idjugador = " +
                    miid + " ORDER BY admin, J.eliteuser"
                let s1, s2 = "",
                    s3, admin
                mysqlcon.getConnection(function (err, con) {
                    con.query(sql2, function (err, result) {
                        if (err) throw err;
                        //Genero la tabla y sus columnas
                        s1 = `<div class="centrar center" id="tablapanel" style="width: 400px; margin-top:10%">
                    <table><td colspan="6">Panel de Administración de la Liga Élite</td>
                    <tr><th>Usuario de Elite</th><th>Puntos</th><th>Centro</th><th>Admin</th>
                    <th>Cambiar Admin</th><th>Eliminar Usuario</th></tr>`
                        //Relleno los datos de cada fila y añado los botones con la id que me conviene
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].admin == 1) {
                                admin = "Sí"
                            } else {
                                admin = "No"
                            }
                            s2 += `<tr>
                            <td>` + result[i].eliteuser + `</td>
                            <td>` + result[i].puntos + `</td>
                            <td>` + result[i].nombre + `</td>
                            <td>` + admin + `</td>
                            <td><button id=c` + result[i].idjugador + ` style="width:100%; height:100%">Cambiar</button</td>
                            <td><button id=x` + result[i].idjugador + ` style="width:100%; height:100%">X</button</td>
                            </tr>`
                        }
                        s3 = `</table></div>`
                        $('body').append(s1 + s2 + s3)
                        var bns = document.getElementsByTagName("button");
                        //Añado listeners a todos los botones de la página
                        for (i = 0; i < bns.length; i++) {
                            bns[i].addEventListener("click", function () {
                                //var res = str.substring(0, 1);
                                if(this.id.substring(0,1) == "c"){
                                    modificarAdmin(this.id.substring(1))
                                }else if(this.id.substring(0,1) == "x"){
                                    borrarUsuario(this.id.substring(1))
                                }
                            });
                        }
                    });
                    con.release();
                });
            }
        });
        con.release();
    });
}

//Si es admin, le quito el admin. Si no lo es se lo asigno
function modificarAdmin(id){
    console.log("modificar"+id)
}

//Borro el usuario
function borrarUsuario(id){
    console.log("borrar"+id)
}