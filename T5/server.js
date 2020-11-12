var http = require('http');
const axios = require('axios');
const booststrapLink = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"/>';

http.createServer(function (req, res) {
    console.log(req.method +  " " + req.url);

    if (req.method == 'GET') {
        if (req.url == '/') {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            res.write(booststrapLink);
            res.write('<h1>Listas disponíveis: </h1>');
            res.write('<h6>(Selecione uma)</h6>');
            res.write('<div class="list-group">');
            res.write('<a href="/alunos" class="list-group-item list-group-item-action">Lista de Alunos</a></li>');
            res.write('<a href="/cursos" class="list-group-item list-group-item-action">Lista de Cursos</a></li>');
            res.write('<a href="/instrumentos" class="list-group-item list-group-item-action">Lista de Instrumentos</a></li>');
            res.write('</div>');
            res.end(); 
        }
        // ALUNOS
        else if (req.url == '/alunos'|| req.url.match(/\/alunos\?_page=[0-9]+$/)){
            var page = req.url.match(/\/alunos\?_page=[0-9]+$/) != undefined ?  req.url.replace('/alunos?_page=', '') : 1;

            axios.get('http://localhost:3001/alunos?_page='+ page)
                .then(resp => {
                    alunos = resp.data;

                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(booststrapLink);
                    res.write('<div class="jumbotron"><h1 class="display-4">Escola de Música: Lista de Alunos</h1>');
                    res.write('<table class="table table-striped">');
                    res.write('<thead><tr><th scope="col">ID</th><th scope="col">Nome</th></tr></thead><tbody>');

                    alunos.forEach(element => {
                        res.write('<tr>');
                        res.write('<th scope="row"><a href="alunos/' + element.id + '">'+ element.id +'</a></th>');
                        res.write('<td><a href="alunos/' + element.id + '">' + element.nome + '</a></td>');
                        res.write('</tr>');
                    });

                    res.write('</tbody></table>');

                    var pags = resp.headers.link.split(',');
                    var flagNext = false;

                    res.write('<center>');
                    res.write('<div class="btn-group center" role="group" aria-label="Basic example">');
                    res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="/">Home Page</a></button>');

                    pags.forEach(pag => {
                        if (pag.includes("first") && page != 1)
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Início da Lista</a></button>');
                        else if (pag.includes("next")){
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Seguinte</a></button>');
                            flagNext = true;
                        }
                        else if (pag.includes("prev"))
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Anterior</a></button>');
                        else if (pag.includes("last") && flagNext)
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Último</a></button>');
                    });

                    res.write('</div>');
                    res.write('</center>');
                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção na lista de alunos: ' + error);
                })
        }
        else if (req.url.match(/\/alunos\/(A|PG)[0-9]+$/)) {
            var num = req.url.replace('/alunos/', '');

            axios.get('http://localhost:3001/alunos/' + num)
                .then(resp => {
                    data = resp.data;
                    console.log(data);
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(booststrapLink);
                    res.write('<div class="jumbotron">');
                    res.write('<h1 class="display-4">' + data.nome + '</h1>');
                    res.write('<h6>' + data.id + '</h6>');
                    res.write('<h6><i>Instrumento: ' + data.instrumento + '</i></h6>');
                    res.write('<p class="badge badge-secondary"> ' + data.dataNasc + '</p>');
                    res.write('<hr class="my-4"/>');
                    res.write('<p><b>Curso: </b>' + data.anoCurso + ' - ' +data.curso + '</p>');
                    res.write('<hr/>');
                    res.write('<center>');
                    res.write('<div class="btn-group center" role="group" aria-label="Basic example">');
                    res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="/alunos">Voltar</a></button>');
                    res.write('</div>');
                    res.write('</center>');
                    res.write('</div>');
                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção na lista de alunos: ' + error);
                })
        }
        // CURSOS
        else if (req.url == '/cursos' || req.url.match(/\/cursos\?_page=[0-9]+$/)){
            var page = req.url.match(/\/cursos\?_page=[0-9]+$/) != undefined ?  req.url.replace('/cursos?_page=', '') : 1;

            axios.get('http://localhost:3001/cursos?_page='+ page)
                .then(resp => {
                    cursos = resp.data;

                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(booststrapLink);
                    res.write('<div class="jumbotron"><h1 class="display-4">Escola de Música: Lista de Cursos</h1>');
                    res.write('<table class="table table-striped">');
                    res.write('<thead><tr><th scope="col">ID</th><th scope="col">Nome</th></tr></thead><tbody>');

                    cursos.forEach(element => {
                        res.write('<tr>');
                        res.write('<th scope="row"><a href="cursos/' + element.id + '">'+ element.id +'</a></th>');
                        res.write('<td><a href="cursos/' + element.id + '">' + element.designacao + '</a></td>');
                        res.write('</tr>');
                    });

                    res.write('</tbody></table>');
                    res.write('</tbody></table>');

                    var pags = resp.headers.link.split(',');
                    var flagNext = false;

                    res.write('<center>');
                    res.write('<div class="btn-group center" role="group" aria-label="Basic example">');
                    res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="/">Home Page</a></button>');

                    pags.forEach(pag => {
                        if (pag.includes("first") && page != 1)
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Início da Lista</a></button>');
                        else if (pag.includes("next")){
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Seguinte</a></button>');
                            flagNext = true;
                        }
                        else if (pag.includes("prev"))
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Anterior</a></button>');
                        else if (pag.includes("last") && flagNext)
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Último</a></button>');
                    });

                    res.write('</div>');
                    res.write('</center>');
                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção na lista de cursos: ' + error);
                })
        }
        else if (req.url.match(/\/cursos\/(CS|CB)[0-9]+$/)) {
            var num = req.url.replace('/cursos/', '');

            axios.get('http://localhost:3001/cursos/' + num)
                .then(resp => {
                    data = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(booststrapLink);
                    res.write('<div class="jumbotron">');
                    res.write('<h1 class="display-4">' + data.designacao + '</h1>');
                    res.write('<h6>' + data.id + '</h6>');
                    res.write('<p class="badge badge-secondary"> ' + data.duracao + ' anos</p>');
                    res.write('<hr class="my-4"/>');
                    res.write('<p><b>Instrumento: </b>' + data.instrumento.id + '-' + data.instrumento['#text'] + '</p>');
                    res.write('<hr/>');
                    res.write('<center>');
                    res.write('<div class="btn-group center" role="group" aria-label="Basic example">');
                    res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="/cursos">Voltar</a></button>');
                    res.write('</div>');
                    res.write('</center>');
                    res.write('</div>');
                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção na lista de cursos: ' + error);
                })
        }
         // INSTRUMENTOS
         else if (req.url == '/instrumentos' || req.url.match(/\/instrumentos\?_page=[0-9]+$/)){
            var page = req.url.match(/\/instrumentos\?_page=[0-9]+$/) != undefined ?  req.url.replace('/instrumentos?_page=', '') : 1;

            axios.get('http://localhost:3001/instrumentos?_page='+ page)
                .then(resp => {
                    instrumentos = resp.data;

                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(booststrapLink);
                    res.write('<div class="jumbotron"><h1 class="display-4">Escola de Música: Lista de Instrumentos</h1>');
                    res.write('<table class="table table-striped">');
                    res.write('<thead><tr><th scope="col">ID</th><th scope="col">Nome</th></tr></thead><tbody>');

                    instrumentos.forEach(element => {
                        res.write('<tr>');
                        res.write('<th scope="row"><a href="instrumentos/' + element.id + '">'+ element.id +'</a></th>');
                        res.write('<td><a href="instrumentos/' + element.id + '">' + element['#text'] + '</a></td>');
                        res.write('</tr>');
                    });

                    res.write('</tbody></table>');

                    var pags = resp.headers.link.split(',');
                    var flagNext = false;

                    res.write('<center>');
                    res.write('<div class="btn-group center" role="group" aria-label="Basic example">');
                    res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="/">Home Page</a></button>');

                    pags.forEach(pag => {
                        if (pag.includes("first") && page != 1)
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Início da Lista</a></button>');
                        else if (pag.includes("next")){
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Seguinte</a></button>');
                            flagNext = true;
                        }
                        else if (pag.includes("prev"))
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Anterior</a></button>');
                        else if (pag.includes("last") && flagNext)
                            res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="'+pag.split(';')[0].replace('<', '').replace('>','').replace('3001', '4000') +'" >Último</a></button>');
                    });

                    res.write('</div>');
                    res.write('</center>');
                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção na lista de instrumentos: ' + error);
                })
        }
        else if (req.url.match(/\/instrumentos\/(I)[0-9]+$/)) {
            var num = req.url.replace('/instrumentos/', '');

            axios.get('http://localhost:3001/instrumentos/' + num)
                .then(resp => {
                    data = resp.data;
                    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                    res.write(booststrapLink);
                    res.write('<div class="jumbotron">');
                    res.write('<h1 class="display-4">' + data['#text']  + '</h1>');
                    res.write('<h6>' + data.id + '</h6>');
                    res.write('<hr/>');
                    res.write('<center>');
                    res.write('<div class="btn-group center" role="group" aria-label="Basic example">');
                    res.write('<button type="button" class="btn btn-secondary"><a style="color: white; !important" href="/instrumentos">Voltar</a></button>');
                    res.write('</div>');
                    res.write('</center>');
                    res.write('</div>');
                    res.end();
                })
                .catch(function (error) {
                    console.log('Erro na obtenção na lista de instrumentos: ' + error);
                })
        }
        else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("<p>Pedido não suportado:" + req.method + " " + req.url + " </p>");
            res.end(); 
        }
    }
    else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<p>Pedido não suportado:" + req.method + " " + req.url + " </p>");
        res.end(); 
    }

}).listen(4000);

console.log('Servidor na porta 4000...');