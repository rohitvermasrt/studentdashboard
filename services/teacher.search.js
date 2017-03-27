var elasticsearch = require('elasticsearch');
var config = require('config.json');
var client = new elasticsearch.Client({
    host: config.elasticSearchConnection
});