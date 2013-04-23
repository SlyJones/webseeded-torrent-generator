'use strict';

var _ = require('lodash');
var q = require('q');
var bencode = require('bencode');
var assert = require('assert');
var crypto = require('crypto');
var HttpHasher = require('./http-hasher');
var HttpFile = require('./http-fs');

var PIECE_SIZE = 0x40000;

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

    this.getMetadata = _.memoize(this.getMetadata);
};

Torrent.prototype.getMetadata = function () {
    return q.all([
        this.getAnnounce(),
        this.getAnnounceList(),
        this.getInfo(),
        this.getUrlList()
    ]).spread(function (announce, announceList, info, urlList) {
        var data = {
            announce: announce,
            'announce-list': announceList,
            info: info,
            'url-list': urlList
        };
        var metadata = bencode.encode(data);
        return q.resolve(metadata);
    });
};

Torrent.prototype.getAnnounce = function () {
    return q.resolve('udp://tracker.publicbt.com:80/announce');
};

Torrent.prototype.getAnnounceList = function () {
    return q.resolve([
        ['udp://tracker.publicbt.com:80/announce'],
        ['udp://tracker.openbittorrent.com:80/announce']
    ]);
};

Torrent.prototype.getInfo = function () {
    return q.all([
        this.getName(),
        this.getPieceLength(),
        this.getPieces(),
        this.getFiles()
    ]).spread(function (name, pieceLength, pieces, files) {
        return q.resolve({
            name: name,
            'piece length': pieceLength,
            pieces: pieces,
            files: files
        });
    });
};

Torrent.prototype.getInfoHash = function () {
    return q.all([
        this.getInfo()
    ]).spread(function (info) {
        var shasum = crypto.createHash('sha1');
        shasum.update(bencode.encode(info));
        var infoHash = shasum.digest('hex');
        return q.resolve(infoHash);
    });
};

Torrent.prototype.getUrlList = function () {
    return q.resolve([this.base]);
};

Torrent.prototype.getName = function () {
    return q.resolve(this.name);
};

Torrent.prototype.getPieceLength = function () {
    return q.resolve(PIECE_SIZE);
};

Torrent.prototype.getPieces = function () {
    var httpFiles = _.map(this.files, function (file) {
        return new HttpFile(this.base + this.name + '/' + file);
    }.bind(this));

    var hasher = new HttpHasher(httpFiles, PIECE_SIZE);
    var pieceHashes = [];
    return hasher.hash().then(function () {
        var pieces = _.reduce(pieceHashes, function (memo, hash) {
            return memo + hash;
        }, '');
        assert(pieces.length % 20 === 0, 'incorrect pieces length');

        return q.resolve(new Buffer(pieces, 'hex'));
    }, function () {
    }, function (hash) {
        pieceHashes.push(hash);
    });
};

Torrent.prototype.getFiles = function () {
    return seq(_.map(this.files, function (file) {
        return function () {
            var httpFile = new HttpFile(this.base + this.name + '/' + file);
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
