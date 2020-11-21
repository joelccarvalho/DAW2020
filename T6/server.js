var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static')
var {parse} = require('querystring')

// Aux. Functions
// Retrieves student info from request body --------------------------------
function recoverInfo(request, callback){
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

function tasksNotPerformed(tasks, d){
    let pagHTML = `
        <div class="card" id="tasksNotPerformed">
            <div class="card-body">
                <h2 class="card-title">
                    <a href="#">
                        <span>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                            </svg>
                        </span>
                    </a>
                    Lista de tarefas por realizar 
                </h2>
                <table class="table table-striped">
                    <tr>
                        <th scope="col">Data de Criação</th>
                        <th scope="col">Data de Término</th>
                        <th scope="col">Atribuída a</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Tipo</th>
                        <th scope="col"></th>
                    </tr>
        `
        var count = 0;

        tasks.forEach(element => {
            if (!element.status) {
                count++;
                pagHTML += `
                    <tr>
                        <td>${element.dateCreated}</td>
                        <td>${element.dateDue}</td>
                        <td>${element.who}</td>
                        <td>${element.what}</td>
                        <td>${element.type}</td>
                        <td>
                            <a class="btn btn-warning" href="/tasks/${element.id}/edit">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </a>
                            <a class="btn btn-danger" href="/tasks/${element.id}/delete">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                </svg>
                            </a>
                        </td>
                    </tr>        
                `
            }
        });

        if (count == 0)
        {
            pagHTML += `
                    <tr>
                        <td>Sem Tarefas Realizadas.</td>
                    </tr>        
                `
        }

        pagHTML += `
            </table>
            </div>
            </div>
        `

  return pagHTML
}

function tasksPerformed(tasks, d){
    let pagHTML = `
        <br>
        <div class="card" id="tasksPerformed">
            <div class="card-body">
                <h2 class="card-title">
                    <a href="#">
                        <span>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                            </svg>
                        </span>
                    </a>
                    Lista de tarefas realizadas
                </h2>
                <table class="table table-striped">
                    <tr>
                        <th scope="col">Data de Criação</th>
                        <th scope="col">Data de Término</th>
                        <th scope="col">Atribuída a</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Tipo</th>
                        <th scope="col"></th>
                    </tr>
        `
    var count = 0;

    tasks.forEach(element => {
        if (element.status) {
            count++;
            pagHTML += `
                <tr>
                    <td>${element.dateCreated}</td>
                    <td>${element.dateDue}</td>
                    <td>${element.who}</td>
                    <td>${element.what}</td>
                    <td>${element.type}</td>
                    <td>
                            <a class="btn btn-warning" href="/tasks/${element.id}/edit">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </a>
                            <a class="btn btn-danger" href="/tasks/${element.id}/delete">
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                </svg>
                            </a>
                        </td>
                </tr>        
            `
        }
    });

    if (count == 0)
    {
        pagHTML += `
                <tr>
                    <td>Sem Tarefas Realizadas.</td>
                </tr>        
            `
    }

    pagHTML += `
        </table>
        </div>
        </div>
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

function header() {
    return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="/">
                <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/tasks-5-213479.png" style="width:30px;">
                Tarefitas
            </a>
        </nav>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
    
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link" href="#tasksNotPerformed">Tarefas Por Realizar</a>
                </li>
                <li>
                    <a class="nav-link" href="#tasksPerformed">Tarefas Realizadas</a>
                </li>
                <li>
                    <a class="nav-link" href="#addTasks">Nova Tarefa</a>
                </li>
            </ul>
        </div>
    </nav>
    `
}

// Formulario para alteração
function editTask(data, d) {
    return `
        <br/>
        <h2 id="addTasks">Editar tarefa: ${data.id}</h2>

        <form action="/tasks/edit" method="POST">
        <div class="form-group" style="display:none;">
            <label for="exampleInputID1">ID</label>
            <input type="number" class="form-control" id="exampleInputID1" name="id" value="${data.id}">
        </div>
        <div class="form-group" style="display:none;">
            <label for="exampleInputDatadue1">Data de Término</label>
            <input type="text" class="form-control" id="exampleInputDatadue1" name="dateDue" value="${data.dateDue}">
        </div>
        <div class="form-group">
            <label for="exampleInputWho1">Atribuída a</label>
            <input type="text" class="form-control" id="exampleInputWho1" name="who" value="${data.who}">
        </div>
        <div class="form-group">
            <label for="exampleFormControlWhat1">Descrição</label>
            <textarea class="form-control" id="exampleFormControlWhat1" rows="3" name="what">${data.what}</textarea>
        </div>

        <div class="row">
            <legend class="col-form-label col-sm-2 pt-0">Tipo</legend>
            <div class="col-sm-10">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="type" id="gridRadios1" value="Normal" ${(data.type == "Normal") ? "checked" : ""}>
                    <label class="form-check-label" for="gridRadios1">
                        Normal
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="type" id="gridRadios2" value="Importante" ${(data.type == "Importante") ? "checked" : ""}>
                    <label class="form-check-label" for="gridRadios2">
                        Importante
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="type" id="gridRadios3" value="Urgente" ${(data.type == "Urgente") ? "checked" : ""}>
                    <label class="form-check-label" for="gridRadios3">
                        Urgente
                    </label>
                </div>
            </div>
        </div>

        <center>
            <button type="submit" class="btn btn-primary">Editar</button>
            <button type="reset" class="btn btn-danger">Limpar</button>
        </center>
    </form>
    `
}

function formAddTask() {
    return `
        <br/>
        <h2 id="addTasks" class="card-title">
            <a href="#">
                <span>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                    </svg>
                </span>
            </a>
            Registo de nova tarefa
        </h2>

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
                    <input class="form-check-input" type="radio" name="type" id="gridRadios2" value="Importante">
                    <label class="form-check-label" for="gridRadios2">
                        Importante
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="type" id="gridRadios3" value="Urgente">
                    <label class="form-check-label" for="gridRadios3">
                        Urgente
                    </label>
                </div>
            </div>
        </div>

        <button type="submit" class="btn btn-primary">Adicionar</button>
        <button type="reset" class="btn btn-danger">Limpar</button>
    </form>
    `
}


function spa(tasks, d, taskToEdit){
    return `
    <html>
        <head>
            <title>My Tasks</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="style.css">
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            
        </head>
        <body>
            <div class = "container">
                ${header()}
                ${tasksNotPerformed(tasks, d)}
                ${tasksPerformed(tasks, d)}
                ${taskToEdit == null ? formAddTask() : editTask(taskToEdit, d)}
                ${footer(d)}
            </div>
        </body>
    </html>
    `
}

function dateFormatted(){
    var date = new Date(),
        day  = date.getDate().toString(),
        dayF = (day.length == 1) ? '0'+ day : day,
        month  = (date.getMonth()+1).toString(),
        monthF = (month.length == 1) ? '0'+month : month,
        yearF = date.getFullYear();
    return dayF+"/"+monthF+"/"+yearF;
}

var server = http.createServer(function (req, res) {
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
                    axios.get("http://localhost:3000/tasks?_sort=dateCreated")
                        .then(response => {
                            var tasks = response.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(spa(tasks, d, null))
                            res.end()
                        })
                        .catch(function(erro){
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write("<p>Não foi possível obter a lista de tarefas...")
                            res.end()
                    })
                }
                // GET /tasks/add --------------------------------------------------------------------
                else if(req.url == "/tasks/add"){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(spa(d))
                    res.end()
                }
                // DELETE /tasks/:id/delete --------------------------------------------------------------------
                else if(/\/tasks\/[0-9]+\/delete$/.test(req.url)){
                    var idTask = req.url.split("/")[2]
                    axios.delete("http://localhost:3000/tasks/" + idTask)
                        .then( response => {
                            axios.get("http://localhost:3000/tasks?_sort=dateCreated")
                                    .then(response => {
                                        var tasks = response.data
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8;', })
                                        res.write(spa(tasks, d, null))
                                        res.end()
                                    })
                                    .catch(function(erro){
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write("<p>Não foi possível obter a lista de tarefas...")
                                        res.end()
                                })
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possivel obter o registo da tarefa.</p>')
                            res.end()
                        })
                }
                // GET /tasks/:id/edit --------------------------------------------------------------------
                else if(/\/tasks\/[0-9]+\/edit$/.test(req.url)){
                    var idTask = req.url.split("/")[2]

                    axios.get("http://localhost:3000/tasks/" + idTask)
                        .then( result => {
                            let dataToEdit = result.data
                            axios.get("http://localhost:3000/tasks?_sort=dateCreated")
                                    .then(response => {
                                        var tasks = response.data
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8;', })
                                        res.write(spa(tasks, d, dataToEdit))
                                        res.end()
                                    })
                                    .catch(function(erro){
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write("<p>Não foi possível obter a lista de tarefas...")
                                        res.end()
                                })
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possivel obter o registo da tarefa.</p>')
                            res.end()
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url == '/tasks'){
                    recoverInfo(req, resultado => {
                        resultado.dateCreated = dateFormatted() // add today date
                        resultado.status = 0
                        console.log('POST de tasks:' + JSON.stringify(resultado))
                        axios.post('http://localhost:3000/tasks', resultado)
                            .then(resp => {
                                axios.get("http://localhost:3000/tasks?_sort=dateCreated")
                                    .then(response => {
                                        var tasks = response.data
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write(spa(tasks, d, null))
                                        res.end()
                                    })
                                    .catch(function(erro){
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write("<p>Não foi possível obter a lista de tarefas...")
                                        res.end()
                                })
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }
                else if (req.url == '/tasks/edit') {
                    recoverInfo(req, resultado => {
                        resultado.dateCreated = dateFormatted() // add today date
                        console.log('PUT de task:' + JSON.stringify(resultado))
                        axios.put('http://localhost:3000/tasks/' + resultado.id, resultado)
                            .then(resp => {
                                axios.get("http://localhost:3000/tasks?_sort=dateCreated")
                                    .then(response => {
                                        var tasks = response.data
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write(spa(tasks, d, null))
                                        res.end()
                                    })
                                    .catch(function(erro){
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write("<p>Não foi possível obter a lista de tarefas...")
                                        res.end()
                                })
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
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }
    }
})

server.listen(7777)
console.log('Servidor à escuta na porta 7777...')