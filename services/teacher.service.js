var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var elasticsearch = require('elasticsearch');
var config = require('config.json');
var client = new elasticsearch.Client({
    host: config.elasticSearchConnection
});
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('teachers');

var service = {};
service.getAllTeachers = getAllTeachers;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAllTeachers() {
    var deferred = Q.defer();
    db.teachers.find().toArray(function(err, teachers) {
            if (err) deferred.reject(err.name + ': ' + err.message); 
            if (teachers) {
                // return user (without hashed password)
                deferred.resolve(teachers);
            } else {
                // user not found
                deferred.resolve();
            }
    });
    
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();

    db.teachers.findById(_id, function (err, teacher) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (teacher) {
            // return user (without hashed password)
            deferred.resolve(teacher);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(teacherParam) {
    var deferred = Q.defer();
    db.teachers.insert(
            teacherParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    return deferred.promise;
}

function update(_id, teacherParam) {
    var deferred = Q.defer();

    // validation
    db.teachers.findById(_id, function (err, teacher) {
        if (err) deferred.reject(err.name + ': ' + err.message);
         var set = {
            name: teacherParam.name,
            age: teacherParam.age,
            sex: teacherParam.sex,
            subject : teacherParam.subject
        };

        db.teachers.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
        });
        
    });
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.teachers.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}