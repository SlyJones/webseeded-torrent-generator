var assert = require('assert');
var fs = require('fs');
var request = require('supertest');
var app = require('../index');

var webseed = {
    base: 'http://ia700201.us.archive.org/6/items/',
    name: 'jj2005-02-27.fm.shnf',
    files: [
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
    ]
};

describe('POST /', function () {
    it('responds with the expected torrent file', function (done) {
        this.timeout(180000);

        var torrent = fs.readFileSync('./test/torrents/test.torrent');

        request(app)
            .post('/')
            .send(webseed)
            .expect(200)
            .expect('content-type', 'application/x-bittorrent')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                assert(torrent.toString() === res.text, 'torrent served does not match expected torrent file');
                done();
            });
    });
});


