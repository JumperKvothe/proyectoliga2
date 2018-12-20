process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-ad115899-d79d-4d23-8bd4-7c1cd13604cc'

const LeagueJs = require('../node_modules/leaguejs/lib/LeagueJS.js');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

//Funciones generales

function gotoinicio() {
    window.location.href = "../html/inicio.html"
}

function gotoindex() {
    window.location.href = "../html/index.html"
}

function gotomodojuego() {
    window.location.href = "../html/modojuego.html"
}

function goto1vs1() {
    window.location.href = "../html/1vs1.html"
    funcionesdb(2);
}

function gotoclasi() {
    window.location.href = "../html/clasi.html"
}

function gotologin() {
    window.location.href = "../html/login.html"
}

function gotoregis() {
    window.location.href = "../html/registrarse.html"
}

function gotoej() {
    window.location.href = "ejemplo.html"
}

function copyToClipboard(element) {
    try {
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).val()).select();
        var retVal = document.execCommand("copy");
        console.log('Copy to clipboard returns: ' + retVal);
        $temp.remove();
    } catch (err) {
        console.log('Error while copying to clipboard: ' + err);
    }
    $('#copia').text("Copiado!")
}

//Funciones goto1vs1

/* $(document).on('ready', function () {
    $(document).on('click', '#btn-ingresar', function () {
        var json = $("#formulario").serialize();
        $.ajax({
            type: "POST",
            url: "http://elitegamingcenter.com/servicio/checklogin",
            data: json,
            success: function (data) {}
        })
    });
}); */

//Function To Display Popup
//Función para mostrar cómo verificar la cuenta de lol desde el cliente
function div_show() {
    document.getElementById('abc').style.display = "block";
    document.getElementById('bienvenido').style.display = "none";
    document.getElementById('eliteuser').style.display = "none";
}
//Function to Hide Popup
function div_hide() {
    document.getElementById('abc').style.display = "none";
}

//Función para sacar el ID de invocador a partir del nombre de invocador introducido
function sacarid() {
    loluser = document.getElementsByName("loluser")[0].value;
    leagueJs.Summoner
        .gettingByName(loluser)
        .then(data => {
            'use strict';
            //Prueba de coger un dato (Funciona). Para probar todo usar ' node server.js '
            const id = data.id;
            verificarlol(id, loluser);
        })
        .catch(err => {
            'use strict';
            alert("El nombre introducido no existe");
            console.log(err);
        });
}

//Función que lleva a cabo la verificación de la cuenta mediante la opción del cliente del LOL
//Hay que controlar si no introducen bien el texto en el LOL
function verificarlol(id, loluser) {
    leagueJs.ThirdPartyCode
        .verifying('VivaElite', id, 'euw')
        .then(data => {
            'use strict';
            if (data) {
                var puntos;
                /////////
                leagueJs.League
                    .gettingPositionsForSummonerId(data.id, 'euw')
                    .then(data => {
                        'use strict';
                        console.log(data)
                        if (data.length == 0) {
                            console.log("unranked")
                            elo = 0
                        } else {
                            console.log("ranked en alguna cola")
                            let pos = 4;
                            for (let i = 0; i < data.length; i++) {
                                if (data[i].queueType.localeCompare("RANKED_SOLO_5x5") == 0) {
                                    pos = i
                                }
                            }
                            if (pos == 4) {
                                elo = 500
                            } else {
                                switch (data[pos].tier) {
                                    case "Bronze":
                                        elo = 750
                                        break;
                                    case "Silver":
                                        elo = 1000
                                        break;
                                    case "Gold":
                                        elo = 1250
                                        break;
                                    case "Platinum":
                                        elo = 1500
                                        break;
                                    case "Diamond":
                                        elo = 1750
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    })
                    .catch(err => {
                        'use strict';
                        console.log(err);
                    });
                console.log(elo)
                addnom(loluser, elo);
            }
        })
        .catch(err => {
            'use strict';
            alert("No se introdució el texto correcto en el cliente de lol")
            console.log(err);
        });
}

//Revisar
//Mostrar el nombre de lol en el index de lol
function imprimirN() {

    let user = JSON.parse(localStorage.getItem('currentUser'))
    leagueJs.Summoner
        .gettingByName(user.loluser)
        .then(data => {
            'use strict';
            console.log(data);
            $(document).ready(function () {
                $(".nombre").html(data.name);
            });
            //////////////////////////////////////////////////////////////////////////////Borrar luego
            leagueJs.League
                .gettingPositionsForSummonerId(data.id, 'euw')
                .then(data => {
                    'use strict';
                    console.log(data)
                })
                .catch(err => {
                    'use strict';
                    console.log(err);
                });
        })
        .catch(err => {
            'use strict';
            console.log(err);
        });
    funcionesdb(5)
}

//Mostrar nombre del usuario en el inicio.html
function mostrarNombre() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    $('#eliteuser').html(user.eliteuser)
}

//Eventos con tecla enter
function enter() {
    if (event.key === 'Enter') {
        funcionesdb(7)
    }
}

//Cargar el loader
function loader() {
    loaders = document.getElementsByClassName('loader-wrapper');
    loaders[0].style.display = "inherit";

    function change(self) {
        for (var i = loaders.length - 1; i >= 0; i--) {
            loaders[i].style.display = "none";
        }
        id = self.id;
        loaders[id - 1].style.display = "inherit";
    };
}

//Cambiar páginas clasificación
function arrow(bool){
    if (bool){
        document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) +1
        funcionesdb(3)
    }else{
        if (parseInt(document.getElementById('tablita').value) != 1) {
            document.getElementById('tablita').value = parseInt(document.getElementById('tablita').value) -1
            funcionesdb(3)
        }
    }
}