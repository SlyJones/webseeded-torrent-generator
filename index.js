'use strict';

var Torrent = require('./lib/torrent');

var base = 'http://ia700201.us.archive.org/6/items';
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
torrent.getMetadata().then(function (metadata) {
    console.log(JSON.stringify(metadata, null, 4));
});
