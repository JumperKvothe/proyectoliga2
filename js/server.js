// setting default platformId to be used if you don't specify it on the endpoint method
process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-0814f46a-da91-4e7e-9368-9a33805acaf3'

const LeagueJs = require('../node_modules/leaguejs/lib/LeagueJS.js');
const leagueJs = new LeagueJs(process.env.LEAGUE_API_KEY);

leagueJs.Summoner
	.gettingByName('JumperKvothe')
	.then(data => {
        'use strict';
        
        console.log(data);
        //Prueba de coger un dato (Funciona). Para probar todo usar ' node server.js '
        const ids = data.id;
        console.log(ids);
        
        $( document ).ready(function() {
			$(".nombre").html(data.name);
			loluser = data.name;
        });
        
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});

/* leagueJs.Summoner
	.gettingByAccount(22177292, 'euw')
	.then(data => {
		'use strict';
		console.log(data);
	})
	.catch(err => {
		'use strict';
		console.log(err);
    }); */
	
leagueJs.League
	.gettingPositionsForSummonerId(76669236, 'euw')	
	.then(data => {
		'use strict';
		console.log(data);
		console.log(data[1].tier, data[1].rank, data[1].wins)
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});

/* leagueJs.ThirdPartyCode
	.verifying('VivaElite', 76669236, 'euw')
	.then(data => {
		'use strict';
		console.log(data);
		if (data){
			loluser = (".name").text
			console.log(loluser)
			addnom(loluser);
		}
	})
	.catch(err => {
		'use strict';
		console.log(err);
	}); */

	/* function crearPartidaLoL() {

    $(".colas").append('<option value="0" selected disabled>Elige una cola</option>')
    $(".colas").append('<option class="1" value="1"> 1 contra 1</option>')
    $(".colas").append('<option class="2" value="2"> 5 contra 5</option>')
	} */

    //Página donde está la API y cómo usarla: https://github.com/Colorfulstan/LeagueJS