var RiotRequest = require('riot-api');

var api = new RiotApi('RGAPI-7b11a6e1-f401-4611-a45a-b74aac374c63');

api.getSummoner({
    'region': 'EUW1',
    'summonerName': 'JumperKvothe'
}, function(data) {
   
});
