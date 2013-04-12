'use strict';

var Torrent = require('./lib/torrent');
var fs = require('fs');
var _ = require('lodash');

var express = require('express');
var app = express();

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

    new Torrent(base, name, files).getMetadata().then(function (metadata) {
        res.type('application/x-bittorrent');
        res.attachment(torrentName);
        res.send(200, metadata);
        console.log('served ' + torrentName);
    });
});

app.listen(3000);

module.exports = app;

