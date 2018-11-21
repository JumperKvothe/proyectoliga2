process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-bf61a41d-fbf1-411f-aaf2-3fd56e9ee12e'

const Kayn = require('../node_modules/kayn/lib/Kayn.js');
const kayn = new Kayn(process.env.LEAGUE_API_KEY);

kayn.Summoner
    .summonerName('JumperKvothe')
	.then(data => {
        'use strict';
        
        console.log(data);
    })
    .catch(err => {
		'use strict';
		console.log(err);
	});


/* leagueJs.Summoner
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
	}); */