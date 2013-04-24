###Usage
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
