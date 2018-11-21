process.env.LEAGUE_API_PLATFORM_ID = 'euw1'
process.env.LEAGUE_API_KEY = 'RGAPI-bf61a41d-fbf1-411f-aaf2-3fd56e9ee12e'

const Kayn = require('../node_modules/kayn/lib/Kayn.js');
const kayn = Kayn(process.env.LEAGUE_API_KEY);

kayn.summonerName(JumperKvothe);
