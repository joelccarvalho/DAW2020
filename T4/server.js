var http = require('http');
var aux = require('./mymod.js');
var fs = require('fs');

http.createServer(function (req, res) {
    console.log(req.method +  " " + req.url +  " " + aux.myDateTime());

    // until 999
    if (req.url.match(/\/arqs\/[0-9]{1,3}$/)) {
        var num = req.url.replace('/arqs/', '');

        if (num <= 122) {
            fs.readFile('site/arq' + num + '.html', function(err, data) {
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.write(data);
                res.end(); 
            });
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write("Número demasiado alto, máximo 122!");
            res.end(); 
        }
    }
    else if (req.url.match(/\/index$/)) {
        fs.readFile('site/index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write(data);
            res.end(); 
        });
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write("O URL não corresponde ao esperado.");
        res.end(); 
    }

}).listen(7777);

console.log('Servidor na porta 7777...');