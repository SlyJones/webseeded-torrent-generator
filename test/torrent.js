// var assert = require('assert');
// //var HttpFile = require('../lib/http-fs').HttpFile;
// var nt = require('nt');

// describe('Torrent Generation', function () {
//     this.timeout(10000);
//     it('generates the same torrent as nt', function (done) {

//     });
// });
'use strict';

var Torrent = require('../lib/torrent');
var fs = require('fs');
var assert = require('assert');
var q = require('q');

describe('Torrent Generation', function () {
    it('generates a replica of a small working internet archive backed torrent', function (done) {
        this.timeout(180000);

        var infoHash = 'ab715690d4c95dd147f6f2fe9f071705bbe22028';
        var torrentFile = fs.readFileSync('./test/torrents/' + infoHash + '.torrent');

        var base = 'http://ia700201.us.archive.org/6/items/';
        var name = 'jj2005-02-27.fm.shnf';
        var files = [
            'jj2005-02-27.fm.d1.md5',
            'jj2005-02-27.fm.d1.txt'
        ];

        var torrent = new Torrent(base, name, files);
        var metadataRequest = torrent.getMetadata().then(function (res) {
            assert(torrentFile.toString() === res.toString(), 'torrent generated matches expected torrent file');
            return q.resolve();
        });

        var infoHashRequest = torrent.getInfoHash().then(function (res) {
            assert(infoHash === res, 'torrent generated matches expected torrent file');
            return q.resolve();
        });

        q.all([
            metadataRequest,
            infoHashRequest
        ]).then(function () {
            done();
        });
    });
    it('generates a replica of a large working internet archive backed torrent', function (done) {
        this.timeout(180000);

        var infoHash = '5c852dd0246f4dc41da16bb5e6bd4d3e9d5ef3a6';
        var torrentFile = fs.readFileSync('./test/torrents/' + infoHash + '.torrent');

        var base = 'http://ia700201.us.archive.org/6/items/';
        var name = 'jj2005-02-27.fm.shnf';
        var files = [
            'jj2005-02-27.fm.d1.md5',
            'jj2005-02-27.fm.d1.txt',
            'jj2005-02-27.fm.d1t1.ogg',
            'jj2005-02-27.fm.d1t1.shn',
            'jj2005-02-27.fm.d1t1_64kb.mp3',
            'jj2005-02-27.fm.d1t1_vbr.mp3',
            'jj2005-02-27.fm.d1t2.ogg',
            'jj2005-02-27.fm.d1t2.shn',
            'jj2005-02-27.fm.d1t2_64kb.mp3',
            'jj2005-02-27.fm.d1t2_vbr.mp3',
            'jj2005-02-27.fm.d1t3.ogg',
            'jj2005-02-27.fm.d1t3.shn',
            'jj2005-02-27.fm.d1t3_64kb.mp3',
            'jj2005-02-27.fm.d1t3_vbr.mp3',
            'jj2005-02-27.fm.d1t4.ogg',
            'jj2005-02-27.fm.d1t4.shn',
            'jj2005-02-27.fm.d1t4_64kb.mp3',
            'jj2005-02-27.fm.d1t4_vbr.mp3',
            'jj2005-02-27.fm.d1t5.ogg',
            'jj2005-02-27.fm.d1t5.shn',
            'jj2005-02-27.fm.d1t5_64kb.mp3',
            'jj2005-02-27.fm.d1t5_vbr.mp3',
            'jj2005-02-27.fm.d1t6.ogg',
            'jj2005-02-27.fm.d1t6.shn',
            'jj2005-02-27.fm.d1t6_64kb.mp3',
            'jj2005-02-27.fm.d1t6_vbr.mp3',
            'jj2005-02-27.fm.d1t7.ogg',
            'jj2005-02-27.fm.d1t7.shn',
            'jj2005-02-27.fm.d1t7_64kb.mp3',
            'jj2005-02-27.fm.d1t7_vbr.mp3',
            'jj2005-02-27.fm.shnf_64kb.m3u',
            'jj2005-02-27.fm.shnf_meta.xml',
            'jj2005-02-27.fm.shnf_vbr.m3u'
        ];

        var torrent = new Torrent(base, name, files);
        var metadataRequest = torrent.getMetadata().then(function (res) {
            assert(torrentFile.toString() === res.toString(), 'torrent generated matches expected torrent file');
            return q.resolve();
        });

        var infoHashRequest = torrent.getInfoHash().then(function (res) {
            assert(infoHash === res, 'torrent generated matches expected torrent file');
            return q.resolve();
        });
        q.all([
            metadataRequest,
            infoHashRequest
        ]).then(function () {
            done();
        });
    });
});

