var Q = require('q');
var config = require('config.json');
var redis = require('then-redis').createClient;
var service = {};
service.getRedisKeyValue = getRedisKeyValue;
service.setRedisKeyValue = setRedisKeyValue;
service.delRedisKey = delRedisKey;
module.exports = service;

function getRedisKeyValue(key)
{
    var deferred = Q.defer();
    const db = redis(config.redisTCP);
    db.get(key).then(function(response){
        if(response){
            console.log('Key found in Redis : ' + key);
            deferred.resolve(response);
        }else {
            // key not found
             deferred.reject('Key not found');
        }
    }).catch(function(err){
        deferred.reject(err);
        console.log('Error while Getting Key from Redis' + err);
    })
    return deferred.promise;
}

function setRedisKeyValue(key,value){
    const db = redis(config.redisTCP);
    db.set(key,value);
    console.log('Key set to redis : ' + key);
}

function delRedisKey(key,value){
    const db = redis(config.redisTCP);
    db.del(key);
}