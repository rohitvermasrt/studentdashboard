var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var redis = require('services/redis.client');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: config.elasticSearchConnection
});
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('students');

var service = {};
service.getAllStudents = getAllStudents;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.search = search;

module.exports = service;

function getAllStudents() {
    var deferred = Q.defer();
    db.students.find().toArray(function(err, students) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (students) {
                // return user (without hashed password)
                deferred.resolve(students);
            } else {
                // user not found
                deferred.resolve();
            }
    });
    
    return deferred.promise;
}

function getById(_id) {
    var deferred = Q.defer();
    redis.getRedisKeyValue(_id).then(function(value){
        console.log('Data coming from Redis Server for Key : ' + _id);
        deferred.resolve(JSON.parse(value));
    }).catch(function(err){
        db.students.findById(_id, function (err, student) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (student) {
            console.log('Data coming direclty from DB');
            // return user (without hashed password)
            redis.setRedisKeyValue(_id,JSON.stringify(student));
            console.log('Data set in Redis Server for cache purpose');
            deferred.resolve(student);
        } else {
            // user not found
            deferred.resolve();
        }
        });
    });

    
    return deferred.promise;
}

function create(studentParam) {
    var deferred = Q.defer();

    // validation
    db.students.findOne(
        { name: studentParam.name },
        function (err, student) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (student) {
                // username already exists
                deferred.reject('Username "' + studentParam.name + '" is already taken');
            } else {
                createStudent();
            }
        });

    function createStudent() {
        
        db.students.insert(
            studentParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                redis.setRedisKeyValue(studentParam._id,JSON.stringify(studentParam));
                console.log('Student save in Redis cache also with id : ' + studentParam._id);
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, studentParam) {
    var deferred = Q.defer();
    updateStudent();
    function updateStudent() {
        // fields to update
        var set = {
            name: studentParam.name,
            age: studentParam.age,
            sex: studentParam.sex,
            class : studentParam.class,
            imagePath : studentParam.imagePath,
            classTeacher : studentParam.classTeacher
        };

        db.students.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                redis.delRedisKey(_id);
                redis.setRedisKeyValue(_id,JSON.stringify(studentParam));
                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.students.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            redis.delRedisKey(_id);
            console.log('Key Deleted from redis id : ' + _id );
            deferred.resolve();
        });

    return deferred.promise;
}

function search(keyword){
    var deferred = Q.defer();
    client.search({
        q: keyword
    }).then(function (body) {
        var students = [];
        body.hits.hits.forEach(function(element) {
           var student = {
                    _id : element._id,
                    name : element._source.name,
                    sex : element._source.sex,
                    age : element._source.age,
                    class : element._source.class,
                    imagePath : element._source.imagePath,
                    classTeacher : element._source.classTeacher
                };  
                students.push(student);
        }, this);
        deferred.resolve(students);
    }, function (error) {
        console.trace(error.message);
        deferred.reject(error.message);
    });
    return deferred.promise;
}
