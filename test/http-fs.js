var assert = require('assert');
var HttpFile = require('../lib/http-fs').HttpFile;

describe('Http File Test', function () {
    this.timeout(3000);
    it('returns the correct file size for big_buck_bunny', function (done) {
        var file = new HttpFile('http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_surround.avi');
        file.size().then(function (size) {
            assert(size === 928670754, 'size returned the wrong file size');
            done();
        }, function (error) {
            assert(false, 'size returned error: ' + error);
            done(new Error(error));
        });
    });

    it('returns the correct file size for jack_johnson_banana_pancakes', function (done) {
        var file = new HttpFile('http://ia700201.us.archive.org/6/items/jj2005-02-27.fm.shnf/jj2005-02-27.fm.d1t2_64kb.mp3');
        file.size().then(function (size) {
            assert(size === 1489315, 'size returned the wrong file size');
            done();
        }, function (error) {
            assert(false, 'size returned error: ' + error);
            done(new Error(error));
        });
    });

    it('supports redirects jack_johnson_banana_pancakes', function (done) {
        var file = new HttpFile('http://archive.org/download/jj2005-02-27.fm.shnf/jj2005-02-27.fm.d1t2_64kb.mp3');
        file.size().then(function (size) {
            assert(size === 1489315, 'size returned the wrong file size');
            done();
        }, function (error) {
            assert(false, 'size returned error: ' + error);
            done(new Error(error));
        });
    });

    it('reads the first 10 bytes of jack_johnson_banana_pancakes correctly', function (done) {
        var file = new HttpFile('http://ia700201.us.archive.org/6/items/jj2005-02-27.fm.shnf/jj2005-02-27.fm.d1t2_64kb.mp3');
        file.read(0, 0x10).then(function (buffer) {
            assert(buffer instanceof Buffer, 'buffer is not a Buffer');
            assert(buffer.toString('hex') === 'fff38064000000000000000000000000', 'incorrect content');
            done();
        }, function (error) {
            assert(false, 'size returned error: ' + error);
            done(new Error(error));
        });
    });
});
