'use strict';

var events = require('events');
var util = require('util');
var crypto = require('crypto');
var q = require('q');
var _ = require('lodash');

var REQUEST_SIZE = 0x1000000;

// Resolves when entire file has been read
// Sends progress notification for each buffer
var requestUrl = function (file) {
    var defer = q.defer();

    file.size().then(function (fileSize) {
        var numPieces = Math.ceil(fileSize / REQUEST_SIZE);

        var queue = q.resolve();
        _.times(numPieces, function (pieceIndex) {
            var requestStart = pieceIndex * REQUEST_SIZE;
            var requestLength = Math.min(REQUEST_SIZE, fileSize - requestStart);
            queue = queue.then(function () {
                return file.read(requestStart, requestLength).then(function (buffer) {
                    defer.notify(buffer);
                    return q.resolve();
                });
            });
        });
        return queue;
    }).then(function () {
        defer.resolve();
    }, function (err) {
        defer.reject(err);
    });

    return defer.promise;
};

// Resolves when all files have been read
// Sends progress notifications for each buffer in sequence
var requestUrls = function (files) {
    var queue = q.resolve();
    _.each(files, function (file) {
        queue = queue.then(function () {
            return requestUrl(file);
        });
    }, this);
    return queue;
};

var Hasher = function (files, pieceSize) {
    this.files = files;
    this.pieceSize = pieceSize;
};

util.inherits(Hasher, events.EventEmitter);

Hasher.prototype.hash = function () {
    var defer = q.defer();
    var buffer = new Buffer(0);

    requestUrls(this.files).then(function () {
        if (buffer.length > 0) {
            var shasum = crypto.createHash('sha1');
            shasum.update(buffer);
            defer.notify(shasum.digest('hex'));
        }
        defer.resolve();
    }, function () {
        return defer.reject();
    }, function (progress) {
        buffer = Buffer.concat([buffer, progress]);

        while (buffer.length > this.pieceSize) {
            var shasum = crypto.createHash('sha1');
            shasum.update(buffer.slice(0, this.pieceSize));
            buffer = buffer.slice(this.pieceSize);
            defer.notify(shasum.digest('hex'));
        }
    }.bind(this));

    return defer.promise;
};

module.exports = Hasher;