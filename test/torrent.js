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

describe('Torrent Generation', function () {
    it('generates a replica of a working internet archive backed torrent', function (done) {
        this.timeout(180000);

        var torrent = fs.readFileSync('./test/torrents/test.torrent');

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

        new Torrent(base, name, files).getMetadata().then(function (metadata) {
            assert(torrent.toString() === metadata.toString(), 'torrent generated matches expected torrent file');
            done();
        });
    });
});

