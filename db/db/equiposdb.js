var mysql = require("mysql");

//Hay que mirar como cargar la conexión desde el main
var con = mysql.createConnection({
    host: "192.168.0.57",
    user: "ligaelite",
    password: "ligaelite",
    database: "formulario",
    multipleStatements: true
});

ipc.on('equiposdb', function (event) {
    listaE()
})

ipc.on('equipos1db', function (event) {
    crearE1()
})

//Función para sacar la lista de equipos
function listaE() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    var sql =
        "SELECT nombre FROM equipos WHERE idj1= " + id + " OR idj2= " +
        id + " OR idj3= " + id + " OR idj4= " + id + " OR idj5= " + id +
        " OR idj6= " + id + " OR idj7= " + id + "";
    con.query(sql, function (err, result) {
        for (i = 0; i < result.length; i++) {
            let nomE = result[i].nombre;
            $(".prueba").append(function () {
                return (
                    ' <div class="caja"><label class="nombreequipo' +
                    i +
                    " botonEq" +
                    i +
                    '" ></label></div>'
                );
            });
            $(".nombreequipo" + i + "").html(nomE);
            $(".botonEq" + i + "").click(function () {
                infoE(nomE);
            });
        }
        if (err) throw err;
    });
}

//Función para sacar la lista de jugadores de un equipo seleccionado
function infoE(nomE) {
    console.log(nomE);
    var sql =
        "SELECT loluser FROM jugadores j JOIN equipos e ON " +
        "j.idjugador = e.idj1 OR " + "j.idjugador = e.idj2 OR " +
        "j.idjugador = e.idj3 OR " + "j.idjugador = e.idj4 OR " +
        "j.idjugador = e.idj5 OR " + "j.idjugador = e.idj6 OR " +
        "j.idjugador = e.idj7 WHERE e.nombre LIKE '" + nomE + "'";
    con.query(sql, function (err, result) {
        console.log(result);
        let tamE = result.length;
        $(".infoE").empty();
        for (i = 0; i < result.length; i++) {
            $(".infoE").append(function () {
                return ' <label class="nombrejug' + i + '"></label><br>';
            });
            $(".nombrejug" + i + "").html(result[i].loluser);
        }
        if (err) throw err;
        compAñaJug(nomE, tamE);
    });
}

//Función para añadir jugador a los equipos
function compAñaJug(nomE, tamE) {
    nomEq = nomE;
    tamEq = tamE;
    var sql =
        "SELECT idj1, idj2, idj3, idj4, idj5, idj6, idj7 FROM equipos where nombre = '" +
        nomEq +
        "'";
    con.query(sql, function (err, result) {
        console.log(result);
        if (result[0].idj2 == null) {
            $(".infoE").append(function () {
                return (
                    ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
                    '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
                );
            });
        } else if (result[0].idj3 == null) {
            $(".infoE").append(function () {
                return (
                    ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
                    '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
                );
            });
        } else if (result[0].idj4 == null) {
            $(".infoE").append(function () {
                return (
                    ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
                    '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
                );
            });
        } else if (result[0].idj5 == null) {
            $(".infoE").append(function () {
                return (
                    ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
                    '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
                );
            });
        } else if (result[0].idj6 == null) {
            $(".infoE").append(function () {
                return (
                    ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
                    '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
                );
            });
        } else if (result[0].idj7 == null) {
            $(".infoE").append(function () {
                return (
                    ' <input type="search" id="busqC" class="form" name="q" placeholder="Busca un compañero"><br>' +
                    '<button onclick="busqC(nomEq, tamEq)">Invitar</button>'
                );
            });
        }
        if (err) throw err;
    });
}

//Funciones para crear un equipo
function crearE1() {
    let cont = 0;
    let nombreE = document.getElementById("nombreE").value;
    sql = "SELECT nombre FROM equipos";
    con.query(sql, function (err, result) {
        for (i = 0; i < result.length; i++) {
            if (nombreE != result[i].nombre) {} else {
                cont++;
            }
        }
        if (cont == 0) {
            crearE2(nombreE);
        } else {
            alert("Nombre ya existente");
        }
        if (err) throw err;
    });
}

function crearE2(nomE) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    let id = user.idjugador;
    console.log(nomE);
    console.log(id);

    sql2 =
        "INSERT INTO equipos (nombre, idj1) VALUES ('" + nomE + "' , " + id + ")";
    con.query(sql2, function (err, result) {
        if (err) throw err;
    });
};