var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var logger = require('morgan')
var multer = require('multer')
var fs = require('fs')
var upload = multer({dest: 'uploads/'})

var app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())
app.use(express.static('public')) // adicionar middleware para imgs carregadas 
app.use(logger('dev')) // detalhes dos pedidos

app.use(function (req, res, next) {
    console.log(JSON.stringify(req.body))
    next()
})

app.get('/', function (req, res) {
    var d = new Date().toISOString().substr(0, 16)
    var files = jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(files, d))
    res.end()
})

app.get('/files/upload', function (req, res) {
    var d = new Date().toISOString().substr(0, 16)
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

// Multi Uploads
app.post('/files', upload.array('myFiles'), function (req, res) {
    var files = jsonfile.readFileSync('./dbFiles.json')
    var d = new Date().toISOString().substr(0, 16)
    
    // Helper to get description
    let i = 0;

    req.files.forEach(element => {
        let oldPath = __dirname + '/' + element.path
        let newPath = __dirname + '/public/fileStore/' + element.originalname

        fs.rename(oldPath, newPath, function(err) {
            if (err) throw err
        })

        files.push({
            date: d,
            name: element.originalname,
            size: element.size,
            mimetype: element.mimetype,
            desc: req.body.desc[i]
        })
        i++;
    });

    jsonfile.writeFileSync('./dbFiles.json', files)
    
    res.redirect('/')
    res.end()
})

// Single Upload
app.post('/files', upload.array('myFile'), function (req, res) {    
    var files = jsonfile.readFileSync('./dbFiles.json')
    var d = new Date().toISOString().substr(0, 16)

    let oldPath = __dirname + '/' + req.file.path
    let newPath = __dirname + '/public/fileStore/' + req.file.originalname

    fs.rename(oldPath, newPath, function(err) {
        if (err) throw err
    })

    files.push({
        date: d,
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        desc: req.body.desc
    })

    jsonfile.writeFileSync('./dbFiles.json', files)
    
    res.redirect('/')
    res.end()
})

app.get('/files/download/:fname', (req, res) => {
    res.download(__dirname + '/public/fileStore/' + req.params.fname)
})

app.listen(7701, () => console.log('Servidor na porta 7701..'))