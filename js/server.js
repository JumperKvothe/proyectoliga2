// setting default platformId to be used if you don't specify it on the endpoint method
process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-68bd4c63-2527-4a81-b737-b8913aea93dc'

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
	
leagueJs.League
	.gettingPositionsForSummonerId(76669236, 'euw')	
	.then(data => {
		'use strict';
		console.log(data);
		console.log(data[1].tier, data[1].rank, data[1].wins)
		/* $( document ).ready(function() {
			$(".nombre").html(data.name);
        }); */
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});

leagueJs.Runes
	.gettingBySummoner(76669236, 'euw')
	.then(data => {
		'use strict';
		console.log(data);
	})
	.catch(err => {
		'use strict';
		console.log(err);
	});
	
    //Página donde está la API y cómo usarla: https://github.com/Colorfulstan/LeagueJS