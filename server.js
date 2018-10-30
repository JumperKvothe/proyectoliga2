var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var request = require('async');
var async = require('async');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    var data = {};
    var api_key = 'RGAPI-7b11a6e1-f401-4611-a45a-b74aac374c63';
    var s_toSearch= 'JumperKvothe';
    var URL = 'https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + s_toSearch;

        async.waterfall([
            function(callback) {
            request(URL, function(err, response, body) {
                if(!err && response.statusCode == 200) {
                var json = JSON.parse(body);
                data.id = json[s_toSearch].id;
                data.name = json[s_toSearch].name;
                callback(null, data);
                } else {
                console.log(err);
                }
            });
            }
        ],
        function(err, data) {
            if(err) {
            console.log(err);
            return;
            }
        
            res.render('index', {
            info: data
            });
        });
    });

var port = Number(process.env.PORT || 3000);
app.listen(port);