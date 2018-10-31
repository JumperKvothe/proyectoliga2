// setting default platformId to be used if you don't specify it on the endpoint method
process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-b050b681-edd0-49aa-b464-db9d7bf94ee5'

const LeagueJs = require('./node_modules/leaguejs/lib/LeagueJS.js');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);


leagueJs.Summoner
	.gettingByName('danireySvQ')
	.then(data => {
        'use strict';
        
        console.log(data);
        //Prueba de coger un dato (Funciona). Para probar todo usar ' node server.js '
        const ids = data.id;
        console.log(ids);
        
        $( document ).ready(function() {
			/* document.getElementById(data.name).innerHTML = Nombre; */
			/* $("#nombre").innerHTML = data.name; */
			$(".nombre").html(data.name);
			/* $("#nombre").text("data.name"); */
			/* $("#nombre").val("data.name"); */
        });
        /* Nombre = $(data.name).val();
        console.log(Nombre); */
        
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});

leagueJs.Summoner
	.gettingByAccount(22177292, 'euw')
	.then(data => {
		'use strict';
		console.log(data);
	})
	.catch(err => {
		'use strict';
		console.log(err);
    });
    
    //Página donde está la API y cómo usarla: https://github.com/Colorfulstan/LeagueJS