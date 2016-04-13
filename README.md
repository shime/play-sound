# play-sound

[![Build Status](https://travis-ci.org/shime/play-sound.svg)](https://travis-ci.org/shime/play-sound)

Play sounds by shelling out to one of the available audio players.

## installation

    npm install play-sound

## examples

```javascript
var player = require('play-sound')(opts = {})
player.play('foo.mp3', function(err){}) // $ mplayer foo.mp3 
```

## options

* `players` – List of available audio players to check. Default:
  * [`mplayer`](https://www.mplayerhq.hu/)
  * [`afplay`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/afplay.1.html)
  * [`mpg123`](http://www.mpg123.de/)
  * [`mpg321`](http://mpg321.sourceforge.net/)
  * [`play`](http://sox.sourceforge.net/)
  * [`omxplayer`](https://github.com/popcornmix/omxplayer)
* `player` – Audio player to use (skips availability checks)

## prior art

[play.js](https://github.com/Marak/play.js) - play sound files from node.js to your speakers

## license

MIT

