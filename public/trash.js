//Esto hay que hacerlo de otra forma
process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-d2382023-19e8-489d-baf2-104f43b99e34'

const LeagueJs = require('../../node_modules/leaguejs/lib/LeagueJS.js');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

//Routing
/* function gotoinicio() {
    window.location.href = "../html/inicio.html"
} */

function gotoindex() {
    window.location.href = "../html/index.html"
}

function gotomodojuego() {
    window.location.href = "../html/modojuego.html"
}

function goto1vs1() {
    window.location.href = "../html/1vs1.html"
    //revisar
    funcionesdb(2);
}

function gotoclasi() {
    window.location.href = "../html/clasi.html"
}

/* function gotologin() {
    window.location.href = "../html/login.html"
} */

/* function gotoregis() {
    window.location.href = "../html/registrarse.html"
} */

function gotoej() {
    window.location.href = "ejemplo.html"
}

//CHATBOX
/*$(document).ready(function () {

    var arr = []; // List of users 

    $(document).on('click', '.msg_head', function () {
        var chatbox = $(this).parents().attr("rel");
        $('[rel="' + chatbox + '"] .msg_wrap').slideToggle('slow');
        return false;
    });


    $(document).on('click', '.close', function () {
        var chatbox = $(this).parents().parents().attr("rel");
        $('[rel="' + chatbox + '"]').hide();
        arr.splice($.inArray(chatbox, arr), 1);
        displayChatBox();
        return false;
    });

    var interval = true
    var m, d

    $(document).on('click', '#sidebar-user-box', function () {

        var userID = $(this).attr("class");
        var username = $(this).children().text();

        if ($.inArray(userID, arr) != -1) {
            arr.splice($.inArray(userID, arr), 1);
        }

        arr.unshift(userID);
        chatPopup = '<div class="msg_box" style="right:270px" rel="' + userID + '">' +
            '<div class="msg_head">' + username +
            '<div class="close">x</div> </div>' +
            '<div class="msg_wrap"> <div class="msg_body"> <div class="msg_push"></div> </div>' +
            '<div class="msg_footer"><input type="text" class="msg_input"></div></div></div>';
        $("body").append(chatPopup);
        displayChatBox();
        recibirMensajes(userID)

        d = new Date()
        d = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() +
            " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        console.log(d)
        clearInterval(m)
        m = setInterval(recibirMensajes2, 1000, d, userID)

         let i = new Interval(recibirMensajes2, 1000, Date.now());
        if (i.isRunning()){
            console.log(i.isRunning() + "off y on")
            i.stop()
            i.start()
        }else{
            console.log(i.isRunning() + "actívate")
            i.start()
        } 
    });

    //Hay que descomentarlo para chatear
 $(document).on('keypress', 'input', function (e) {
        if (e.keyCode == 13) {
            var msg = $(this).val();
            $(this).val('');
            if (msg.trim().length != 0) {
                var chatbox = $(this).parents().parents().parents().attr("rel");
                $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
                $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
            }
            mandarMensajes(chatbox, msg)
        }
    }); 

    function displayChatBox() {
        i = 270; // start position
        j = 260; //next position

        $.each(arr, function (index, value) {
            if (index < 4) {
                $('[rel="' + value + '"]').css("right", i);
                $('[rel="' + value + '"]').show();
                i = i + j;
            } else {
                $('[rel="' + value + '"]').hide();
            }
        });
    }

});
//FIN CHATBOX

function mensaje(msg, chatbox, boolean) {
    if (boolean) {
        $('<div class="msg-right">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    } else {
        $('<div class="msg-left">' + msg + '</div>').insertBefore('[rel="' + chatbox + '"] .msg_push');
        $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
    }
}

var on = false

function Interval(fn, time, parameter) {
    var timer = false;
    this.start = function () {
        timer = setInterval(fn, time, parameter);
        on = true
        console.log(on + "onfire")
    };
    this.stop = function () {
        clearInterval(timer);
        on = false;
    };
    this.isRunning = function () {
        console.log(on + "r")
        return on
    }; 
}*/



//
$(document).ready(function () {
    $(window).on('beforeunload', function () {
        alert('Are you sure you want to leave?');
    });
})

//Otros

//Cargar el loader (1vs1.html) (moverlo a 1vs1.js)
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

//Creo que no se está usando
//
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

//Función que lleva a cabo la verificación de la cuenta mediante la opción del cliente del LOL
//Hay que controlar si no introducen bien el texto en el LOL (se usa desde db.js, hay que arregarlo)
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