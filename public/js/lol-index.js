//onload function
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