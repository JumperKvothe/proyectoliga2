var RiotRequest = require('riot-lol-api');

var riotRequest = new RiotRequest('RGAPI-7b11a6e1-f401-4611-a45a-b74aac374c63');

var cache = {
    get: function(region, endpoint, cb) {
      // Try to read from cache,
      // Return cb(null, data) if data is already available in your cache.
      // If it's a cache-miss, you still need to call cb(null, null) for the request to proceed.
      // Do not just call cb(null)!
      cb(null, null);
    },
    set: function(region, endpoint, cacheStrategy, data) {
      // Use this function to store `data`, which is the result of the API call to `endpoint` on `region`.
    }
  };

  
riotRequest.request('euw1', 'JumperKvothe', '/lol/summoner/v3/summoners/by-name/', function(err, data) {});