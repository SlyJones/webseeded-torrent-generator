'use strict';

var http = require('http');
var URL = require('url');
var assert = require('assert');
var q = require('q');

var HttpFile = function (url) {
    this.url = url;
};

HttpFile.prototype.url = function () {
    return this.url;
};

HttpFile.prototype.hostname = function () {
    return URL.parse(this.url, false).hostname;
};

HttpFile.prototype.path = function () {
    return URL.parse(this.url, false).path;
};

HttpFile.prototype.size = function () {
    var defer = q.defer();
    var headers = {
        range: 'bytes=0-1'
    };

    http.get({
        hostname: this.hostname(),
        path: this.path(),
        headers: headers
    }, function (response) {
        try {
            if (response.statusCode === 301 || response.statusCode === 302) {
                assert(response.headers.hasOwnProperty('location'), 'redirect without a new location');
                this.url = response.headers.location;

                this.size().then(function (size) {
                    defer.resolve(size);
                }, function (error) {
                    defer.reject(error);
                });

                return;
            }
            //require partial content status code
            assert(response.statusCode === 206, 'http server does not support range requests');

            //require that the server returns the size of the entire piece of content
            var contentRangeHeader = response.headers['content-range'];
            assert(typeof contentRangeHeader === 'string', 'content range header not found');

            //parse out the content size
            var match = contentRangeHeader.match(/bytes \d+-\d+\/(\d+)/);
            assert(typeof match === 'object' && match.length === 2, 'invalid content range header');
            var size = parseInt(match[1], 10);

            defer.resolve(size);
        } catch (error) {
            defer.reject(error);
        }
    }.bind(this)).end();
    return defer.promise;
};

HttpFile.prototype.read = function (position, length) {
    var defer = q.defer();
    var start = position;
    var end = position + length - 1;
    var headers = {
        range: 'bytes=' + start + '-' + end
    };

    http.get({
        hostname: this.hostname(),
        path: this.path(),
        headers: headers
    }, function (response) {
        try {
            if (response.statusCode === 301 || response.statusCode === 302) {
                assert(response.headers.hasOwnProperty('location'), 'redirect without a new location');
                this.url = response.headers.location;

                this.read(position, length).then(function (buffer) {
                    defer.resolve(buffer);
                }, function (error) {
                    defer.reject(error);
                });
                return;
            }
            //require partial content status code
            assert(response.statusCode === 206, 'http server does not support range requests - ' + response.statusCode);

            //require that the server returns the size of the entire piece of content
            var contentRangeHeader = response.headers['content-range'];
            assert(typeof contentRangeHeader === 'string', 'content range header not found');

            //parse out the content offset/length information
            var match = contentRangeHeader.match(/bytes (\d+)-(\d+)\/\d+/);
            assert(typeof match === 'object' && match.length === 3, 'invalid content range header');

            assert(parseInt(match[1], 10) === start, 'incorrect range starting byte ' + parseInt(match[1], 10) + '/' + start);
            assert(parseInt(match[2], 10) === end, 'incorrect range ending byte ' + contentRangeHeader);

            var contentLengthHeader = response.headers['content-length'];
            assert(typeof contentLengthHeader === 'string', 'content length header not found');

            assert(parseInt(contentLengthHeader, 10) === length, 'incorrect content length returned ' + contentLengthHeader);

            var buffers = [];
            response.on('data', function (buffer) {
                buffers.push(buffer);
            });
            response.on('end', function () {
                defer.resolve(Buffer.concat(buffers));
            });
        } catch (error) {
            defer.reject(error);
        }
    }.bind(this)).end();
    return defer.promise;
};

module.exports = HttpFile;
