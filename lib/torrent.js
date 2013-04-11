'use strict';

var _ = require('lodash');
var q = require('q');
var assert = require('assert');
var Hasher = require('./hasher');
var HttpFile = require('./http-fs');

var PIECE_SIZE = 0x80000;

var seq = function (funcs) {
    if (funcs.length === 0) {
        return q.resolve([]);
    }

    var fn = _.first(funcs);
    return fn().then(function (result) {
        return seq(_.rest(funcs)).then(function (results) {
            return q.resolve([result].concat(results));
        });
    });
};


var Torrent = function (base, name, files) {
    this.base = base;
    this.name = name;
    this.files = files;
};

Torrent.prototype.getMetadata = function () {
    var metadataFilesRequest = this.getMetadataFiles();
    var piecesRequest = this.getPieces();

    return q.all([metadataFilesRequest, piecesRequest]);
};

Torrent.prototype.getName = function () {
    return this.name;
};

Torrent.prototype.getPieceLength = function () {
    return PIECE_SIZE;
};

Torrent.prototype.getPieces = function () {
    var httpFiles = _.map(this.files, function (file) {
        return new HttpFile(this.base + '/' + this.name + '/' + file);
    }.bind(this));

    var hasher = new Hasher(httpFiles, PIECE_SIZE);
    var start = new Date().getTime();
    var pieceHashes = [];
    return hasher.hash().then(function () {
        console.log('resolved');
        var stop = new Date().getTime();
        var dt = stop - start;
        console.log('Torrent downloading/hashing took ' + (dt / 1000) + ' seconds');

        var pieces = _.reduce(pieceHashes, function (memo, hash) {
            return memo + hash;
        }, '');
        assert(pieces.length % 20 === 0, 'incorrect pieces length');

        return q.resolve(pieces);
    }, function () {
        console.log('rejected');
    }, function (hash) {
        console.log('hash', hash);
        pieceHashes.push(hash);
    });
};

Torrent.prototype.getMetadataFiles = function () {
    return seq(_.map(this.files, function (file) {
        return function () {
            var httpFile = new HttpFile(this.base + '/' + this.name + '/' + file);
            return httpFile.size().then(function (size) {
                return q.resolve({
                    path: file.split('/'),
                    length: size
                });
            });
        }.bind(this);
    }.bind(this)));
};

module.exports = Torrent;
