var config = require('config.json');
var express = require('express');
var router = express.Router();
var teacherService = require('services/teacher.service');

// routes
router.get('/', getAllTeachers);
router.get('/:_id', getTeacher);
router.post('/add', addTeacher);
router.get('/current', getCurrentTeacher);
router.put('/:_id', updateTeacher);
router.delete('/:_id', deleteTeacher);

module.exports = router;

function addTeacher(req, res) {
    teacherService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAllTeachers(req, res) {
    teacherService.getAllTeachers()
        .then(function (teachers) { 
            if (teachers) {
                res.send(teachers);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentTeacher(req, res) {
    teacherService.getById(req.params._id)
        .then(function (teacher) {
            if (teacher) {
                res.send(teacher);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getTeacher(req, res) {
    teacherService.getById(req.params._id)
        .then(function (teacher) {
            if (teacher) {
                res.send(teacher);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTeacher(req, res) {
    var teacherId = req.params._id;
    teacherService.update(teacherId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTeacher(req, res) {
    var teacherId = req.params._id;
    teacherService.delete(teacherId)
    .then(function () {
        res.sendStatus(200);
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}