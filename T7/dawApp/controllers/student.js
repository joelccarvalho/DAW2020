var Student = require('../models/student')

// Returns student list
module.exports.list = () => {
    return Student 
        .find()
        .sort({nome: 1})
        .exec()
} 

// Find
module.exports.lookUp = id => {
    return Student 
        .findOne({numero: id})
        .exec()
} 

// Insert
module.exports.insert = student => {
    var newStudent = new Student(student)
    return newStudent.save()
} 

// Edit
module.exports.edit = student => {
    return Student 
        .update({numero: student.numero}, {$set: {nome: student.nome, git: student.git, tpc: student.tpc}})
        .exec()
} 

// Delete
module.exports.delete = id => {
    return Student 
        .deleteOne({numero: id})
        .exec()
} 