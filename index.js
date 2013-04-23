'use strict';

var Torrent = require('./lib/torrent');
var fs = require('fs');
var _ = require('lodash');
var knox = require('knox');
var assert = require('assert');

var express = require('express');
var app = express();

var nconf = require('nconf');
nconf.file({ file: '.env' });
assert(nconf.get('S3_ID'), 's3 access key id required in .env - S3_ID');
assert(nconf.get('S3_SECRET'), 's3 secret access key required in .env - S3_SECRET');
assert(nconf.get('S3_BUCKET'), 's3 bucket required in .env - S3_BUCKET');

app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());

app.post('/', function(req, res) {
    if(!req.body.hasOwnProperty('base')) {
        return res.send(400, 'base parameter missing');
    } else if (!_.isString(req.body.base)) {
        return res.send(400, 'base parameter is not a valid string');
    }

    if(!req.body.hasOwnProperty('name')) {
        return res.send(400, 'name parameter missing');
    } else if (!_.isString(req.body.name)) {
        return res.send(400, 'name parameter is not a valid string');
    }

    if(!req.body.hasOwnProperty('files')) {
        return res.send(400, 'files parameter missing');
    } else if (!_.isArray(req.body.files)) {
        return res.send(400, 'files parameter is not a valid array');
    }

    var base = req.body.base;
    var name = req.body.name;
    var files = req.body.files;
    var torrentName = name + '.torrent';

    console.log('requesting ' + torrentName);

    var torrent = new Torrent(base, name, files);
    var torrentGeneratorRequest = torrent.getMetadata();

    torrentGeneratorRequest.done(function (metadata) {
        res.type('application/x-bittorrent');
        res.attachment(torrentName);
        res.send(200, metadata);
    });
    torrentGeneratorRequest.fail(function (error) {
        res.send(400, error);
    });
});

app.listen(3000);

module.exports = app;

