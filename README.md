##Background Knowledge
Webseeding means to use servers as bittorrent clients, simulating piece requests using range requests (which the server must support). This is mostly benefitial for bootstrapping swarms.

There are very particular requirements on your server's file paths. The torrent name must be a common segment of all file urls, so each url is constructed by combining the base, the torrent name, and the file name.

If you wish to create a torrent out of the three following urls:
```
http://ia700201.us.archive.org/6/items/jj2005-02-27.fm.shnf/jj2005-02-27.fm.d1.md5
http://ia700201.us.archive.org/6/items/jj2005-02-27.fm.shnf/jj2005-02-27.fm.d1.txt
```
Then you must specify the following arguments:
```js
var base = 'http://ia700201.us.archive.org/6/items/';
var name = 'jj2005-02-27.fm.shnf';
var files = [
    'jj2005-02-27.fm.d1.md5',
    'jj2005-02-27.fm.d1.txt'
];
```
__Warning:__ The *base* must end with ```/```, while the *name* and the *files* must not.

##Usage
```json
{
  "dependencies": {
    "webseeded-torrent-generator": "git://github.com/bittorrent/webseeded-torrent-generator.git"
  }
}
```

```js
var Torrent = require('webseeded-torrent-generator');
var base = 'http://ia700201.us.archive.org/6/items/';
var name = 'jj2005-02-27.fm.shnf';
var files = [
    'jj2005-02-27.fm.d1.md5',
    'jj2005-02-27.fm.d1.txt'
];

var torrent = new Torrent(base, name, files);
// if you want to write out .torrent files, do this
torrent.getMetadata().then(function (buf) {
    fs.writeFileSync('tmp.torrent', buf);
});

// if you want to serve up .torrent files via express,
// do something like the following (assuming we have request/result objects)
torrent.getMetadata().then(function (buf) {
    result.type('application/x-bittorrent');
    result.attachment(name + '.torrent');
    result.send(200, buf);
});
```
