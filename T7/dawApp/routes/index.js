var express = require('express');
var router = express.Router();
var StudentController = require('../controllers/student')

/* GET HOME PAGE */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET STUDENTS */
router.get('/students', function(req, res, next) {
  // Data retrieve
  StudentController.list()
    .then(data => {

      // Add randomId to show a different pictura
      data.forEach(student => {
        student.randomId = Math.floor(Math.random() * (100 - 1) + 1);
      })
      
      res.render('students', { list: data });
    })
    .catch(err => {
      console.log("Something was wrong: ", {error: err});
    })
});

/* GET STUDENTS/ID */
router.get('/students/:id', function(req, res, next) {
  var id = req.params.id

  // Data retrieve
  StudentController.lookUp(id)
    .then(data => {
      res.render('individual_student', { student: data });
    })
    .catch(err => {
      console.log("Something was wrong: ", {error: err});
    })
});

/* GET STUDENTS/EDIT/ID */
router.get('/students/edit/:id', function(req, res, next) {
  var id = req.params.id

  // Data retrieve
  StudentController.lookUp(id)
    .then(data => {
      res.render('edit_student', { student: data });
    })
    .catch(err => {
      console.log("Something was wrong: ", {error: err});
    })
});

/* GET STUDENTS/NEW */
router.get('/addNewStudent', function(req, res, next) {
  res.render('add_student', { title: 'New Student' });
});

/* PUT STUDENTS/ID */
router.put('/students/edit', function(req, res, next) {
  var body = req.body
  
  body.tpc = helperTpcs(body)

  // Edit data
  StudentController.edit(body)
    .then(data => {
      res.render('individual_student', { student: body });
    })
    .catch(err => {
      console.log("Something was wrong: ", {error: err});
    })
});

/* DELETE STUDENTS/ID */
router.delete('/students/delete/:id', function(req, res, next) {
  var id = req.params.id

  // Data retrieve
  StudentController.delete(id)
    .then(data => {
      StudentController.list()
        .then(data => {

          // Add randomId to show a different pictura
          data.forEach(student => {
            student.randomId = Math.floor(Math.random() * (100 - 1) + 1);
          })
          
          res.render('students', { list: data });
        })
        .catch(err => {
          console.log("Something was wrong: ", {error: err});
        })
    })
    .catch(err => {
      console.log("Something was wrong: ", {error: err});
    })
});

/* POST ADD STUDENTS*/
router.post('/addStudent', function(req, res, next) {
  var body = req.body

  body.tpc = helperTpcs(body)

  console.log(body);
  // Insert new
  StudentController.insert(body)
    .then(data => {
      StudentController.list()
        .then(data => {

          // Add randomId to show a different pictura
          data.forEach(student => {
            student.randomId = Math.floor(Math.random() * (100 - 1) + 1);
          })
          
          res.render('students', { list: data });
        })
        .catch(err => {
          console.log("Something was wrong: ", {error: err});
        })
    })
    .catch(err => {
      console.log("Something was wrong: ", {error: err});
    })
});

function helperTpcs(body) {
  tpc = [] // Open clear array

  if (body.tpc1 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc2 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc3 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc4 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc5 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc6 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc7 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  if (body.tpc8 == 'on')
    tpc.push(1)
  else
    tpc.push(0)

  delete body.tpc1
  delete body.tpc2
  delete body.tpc3
  delete body.tpc4
  delete body.tpc5
  delete body.tpc6
  delete body.tpc7
  delete body.tpc8

  return tpc
}

module.exports = router;
