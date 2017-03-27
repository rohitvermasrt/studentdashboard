var config = require('config.json');
var express = require('express');
var router = express.Router();
var studentService = require('services/student.service');

// routes
router.get('/', getAllStudents);
router.get('/:_id', getStudent);
router.post('/add', addStudent);
router.get('/current', getCurrentStudent);
router.put('/:_id', updateStudent);
router.delete('/:_id', deleteStudent);
router.get('/search/:_q',searchStudent);   

module.exports = router;

function addStudent(req, res) {
    studentService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllStudents(req, res) {
    studentService.getAllStudents()
        .then(function (students) { 
            if (students) {
                res.send(students);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentStudent(req, res) {
    studentService.getById(req.student.sub)
        .then(function (student) {
            if (student) {
                res.send(student);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getStudent(req, res) {
    studentService.getById(req.params._id)
        .then(function (student) {
            if (student) {
                res.send(student);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateStudent(req, res) {
    var studentId = req.params._id;
    studentService.update(studentId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function deleteStudent(req, res) {
    var studentId = req.params._id;
    studentService.delete(studentId)
    .then(function () {
        res.sendStatus(200);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

function searchStudent(req,res){
    var searchKeyword = req.params._q;
    studentService.search(searchKeyword)
    .then(function(students){
          if (students) {
                res.send(students);
            } else {
                res.sendStatus(404);
            }
    }).catch(function (err) {
        res.status(400).send(err);
    });
};