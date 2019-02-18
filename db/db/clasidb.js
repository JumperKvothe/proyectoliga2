const mysqlcon = require('../conexion')

ipc.on('loadclasi', function (event) {
    clasificacion()
})

//Mirar cuantos jugadores hay para tener claro si podremos pasar páginas hacia adelante según en la que estemos
function clasificacion() {
    let pag = parseInt(document.getElementById("tablita").value);
    let njug, maxpag;
    let sql = "SELECT * FROM jugadores";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            if (err) throw err;
            njug = result.length;
            maxpag = njug / 7;
            if (njug % 7 != 0) {
                maxpag++;
            }
            if (pag <= maxpag) {
                ordenarClasi(pag, njug);
            } else {
                document.getElementById("tablita").value =
                    parseInt(document.getElementById("tablita").value) - 1;
            }
        });
        con.release();
    });
}

//Consulta los jugadores ordenados por puntos de la página actual de la clasificación y los muestra
function ordenarClasi(pag, njug) {
    let pts, jug
    var sql = `SELECT J.*, nombre  FROM jugadores J JOIN centros C ON J.centro = C.id
     ORDER BY puntos DESC, eliteuser LIMIT ` + (pag - 1) * 7 + ", 7";
    mysqlcon.getConnection(function (err, con) {
        con.query(sql, function (err, result) {
            njug = result.length;
            $(".clas").empty();
            for (i = 0; i < njug; i++) {
                jug = result[i].eliteuser;
                pts = result[i].puntos;
                centro = result[i].centro;
                $(".clas").append(function () {
                    return (
                        '<tr class="odd"><th scope="row">' +
                        (i + (pag - 1) * 7 + 1) +
                        "</th><td>" +
                        jug +
                        "</td><td>" +
                        pts +
                        "</td><td>" +
                        result[i].nombre +
                        "</td></tr>"
                    );
                });
            }
            if (err) throw err;
        });
        con.release();
    });
}