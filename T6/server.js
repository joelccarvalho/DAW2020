var http = require('http')
var axios = require('axios')
var fs = require('fs')

var static = require('./static')

var {parse} = require('querystring')

// Aux. Functions
// Retrieves student info from request body --------------------------------
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

// POST Confirmation HTML Page Template -------------------------------------
function geraPostConfirm(task, d){
    return `
    <html>
    <head>
        <title>POST receipt: ${task.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="style.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa ${task.id} inserido</h1>
            </header>

            <div class="w3-container">
                <p><a href="/tasks/${task.id}">Aceda aqui à sua página.</a></p>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function geraPagTasks(tasks, d){
  let pagHTML = `
    <html>
        <head>
            <title>Lista de tarefas</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="style.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            </head>
        <body>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Lista de Tarefas</h5>
                    <table class="table table-striped">
                        <tr>
                            <th scope="col">Data de Criação</th>
                            <th scope="col">Data de Término</th>
                            <th scope="col">Atribuída a</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Tipo</th>
                        </tr>
  `
  tasks.forEach(element => {
    pagHTML += `
        <tr>
            <td><a href="/tasks/${element.id}">${element.dataCreated}</a></td>
            <td>${element.dateDue}</td>
            <td>${element.who}</td>
            <td>${element.what}</td>
            <td>${element.type}</td>
        </tr>        
    `
  });

  pagHTML += `
            </table> 
            ${geraFormAddTask(d)}
            ${footer(d)}
            <br>
        </body>
    </html>
  `
  return pagHTML
}

function footer(d) {
    return `
        <div class="card border-light mb-3 footer"s>
            <div class="card-header">${d}</div>
                <div class="card-body">
                    <h5 class="card-title">By: Joel Costa Carvalho</h5>
                    <p class="card-text">TP6 - DAW2020</p>
                </div>
            </div>
        </div>
    `
}

// Formulario para alteração
function geraForm2Aluno(a, d){
    return `
    <html>
        <head>
            <title>Alteração de um aluno</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="../style.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Registo de Aluno ${a.id}</h2>
            </div>

            <form class="w3-container" action="/alunos/edit" method="POST">
                <label class="w3-text-teal"><b>Nome</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="nome" value=${a.nome}>
          
                <label class="w3-text-teal"><b>Número / Identificador</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id" value=${a.id}>

                <label class="w3-text-teal"><b>Curso</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="curso" value=${a.curso}>

                <label class="w3-text-teal"><b>Link para o respositório no Git</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="git" value=${a.git}>
          
                <input class="w3-btn w3-blue-grey" type="submit" value="Atualizar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d}</address>
            </footer>
        </body>
    </html>
    `
}

function geraPagAluno( aluno, d ){
    return `
    <html>
    <head>
        <title>Aluno: ${aluno.id}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="style.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Aluno ${aluno.id}</h1>
            </header>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" style="width:50%">
                    <li><b>Nome: </b> ${aluno.nome}</li>
                    <li><b>Número: </b> ${aluno.id}</li>
                    <li><b>Curso: </b> ${aluno.curso}</li>
                    <li><b>Git (link): </b> <a href="${aluno.git}">${aluno.git}</a></li>
                </ul>
            </div>

            <footer class="w3-container w3-teal">
                <address>Gerado por galuno::PRI2020 em ${d} - [<a href="/">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function geraFormAddTask(d){
    return `
    <html>
        <head>
            <title>Registo de uma tarefa</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="style.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Registo de nova tarefa</h2>
            </div>

            <form action="/tasks" method="POST">
                <div class="form-group">
                    <label for="exampleInputID1">ID</label>
                    <input type="number" class="form-control" id="exampleInputID1" name="id">
                </div>
                <div class="form-group">
                    <label for="exampleInputDatadue1">Data de Término</label>
                    <input type="date" class="form-control" id="exampleInputDatadue1" name="dateDue">
                </div>
                <div class="form-group">
                    <label for="exampleInputWho1">Atribuída a</label>
                    <input type="text" class="form-control" id="exampleInputWho1" name="who">
                </div>
                <div class="form-group">
                    <label for="exampleFormControlWhat1">Descrição</label>
                    <textarea class="form-control" id="exampleFormControlWhat1" rows="3" name="what"></textarea>
                </div>

                <div class="row">
                    <legend class="col-form-label col-sm-2 pt-0">Tipo</legend>
                    <div class="col-sm-10">
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="type" id="gridRadios1" value="Normal" checked>
                        <label class="form-check-label" for="gridRadios1">
                            Normal
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="type" id="gridRadios2" value="Urgente">
                        <label class="form-check-label" for="gridRadios2">
                            Importante
                        </label>
                        </div>
                    </div>
                    </div>

                <button type="submit" class="btn btn-primary">Adicionar</button>
                <button type="reset" class="btn btn-danger">Limpar</button>
            </form>
        </body>
    </html>
    `
}

function dateFormatted(){
    var date = new Date(),
        day  = date.getDate().toString(),
        dayF = (day.length == 1) ? '0'+ day : day,
        month  = (date.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = date.getFullYear();
    return dayF+"/"+monthF+"/"+yearF;
}

// CriaÃ§Ã£o do servidor

var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    if (static.recursoEstatico(req)) {
        static.sirvoRecursoEstatico(req, res)
    }
    else {
        switch(req.method){
            case "GET": 
                // GET /tasks --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/tasks")){
                    axios.get("http://localhost:3000/tasks?_sort=dataCreated")
                        .then(response => {
                            var tasks = response.data

                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagTasks(tasks, d))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possÃ­vel obter a lista de alunos...")
                            res.end()
                        })
                }
                // GET /alunos/:id --------------------------------------------------------------------
                else if(/\/alunos\/(A|PG)[0-9]+$/.test(req.url)){
                    var idAluno = req.url.split("/")[2]
                    axios.get("http://localhost:3000/alunos/" + idAluno)
                        .then( response => {
                            let a = response.data
                            
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPagAluno(a, d))
                            res.end()
                        })
                }
                // GET /tasks/add --------------------------------------------------------------------
                else if(req.url == "/tasks/add"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(geraFormAddTask(d))
                    res.end()
                }
                // GET /alunos/:id/edit --------------------------------------------------------------------
                else if(/\/alunos\/(A|PG)[0-9]+\/edit$/.test(req.url)){
                    var idAluno = req.url.split("/")[2]

                    var idAluno = req.url.split("/")[2]
                    axios.get("http://localhost:3000/alunos/" + idAluno)
                        .then( response => {
                            let a = response.data
                            
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraForm2Aluno(a, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possivel obter o registo do aluno.</p>')
                            res.end()
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " nÃ£o suportado neste serviÃ§o.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url == '/tasks'){
                    recuperaInfo(req, resultado => {
                        resultado.dataCreated = dateFormatted() // add today date
                        console.log('POST de tasks:' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/tasks', resultado)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPostConfirm(resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                else if (req.url == '/alunos/edit') {
                    recuperaInfo(req, resultado => {
                        console.log('PUT de aluno:' + JSON.stringify(resultado))
                        axios.put('http://localhost:3000/alunos/' + resultado.id, resultado)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraPostConfirm( resp.data, d))
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no PUT: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Recebi um POST não suportado.</p>')
                    res.write('<p><a href="/">Voltar</a></p>')
                    res.end()
                }
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " nÃ£o suportado neste serviÃ§o.</p>")
                res.end()
        }
    }
})

galunoServer.listen(7778)
console.log('Servidor à escuta na porta 7778...')