# play-sound

[![Build Status](https://travis-ci.org/shime/play-sound.svg)](https://travis-ci.org/shime/play-sound) [![Downloads](https://img.shields.io/npm/dt/play-sound.svg)](https://npmjs.org/package/play-sound)

Play sounds by shelling out to one of the available audio players.

## Installation

    npm install play-sound

## Examples

```javascript
var player = require('play-sound')(opts = {})

// $ mplayer foo.mp3 
player.play('foo.mp3', function(err){
  if (err) throw err
})

// { timeout: 300 } will be passed to child process
player.play('foo.mp3', { timeout: 300 }, function(err){
  if (err) throw err
})

// configure arguments for executable if any
player.play('foo.mp3', { afplay: ['-v', 1 ] /* lower volume for afplay on OSX */ }, function(err){
  if (err) throw err
})

// access the node child_process in case you need to kill it on demand
var audio = player.play('foo.mp3', function(err){
  if (err && !err.killed) throw err
})
audio.kill()
```

## Options

* `players` – List of available audio players to check. Default:
  * [`mplayer`](https://www.mplayerhq.hu/)
  * [`afplay`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/afplay.1.html)
  * [`mpg123`](http://www.mpg123.de/)
  * [`mpg321`](http://mpg321.sourceforge.net/)
  * [`play`](http://sox.sourceforge.net/)
  * [`omxplayer`](https://github.com/popcornmix/omxplayer)
  * [`aplay`](https://linux.die.net/man/1/aplay)
  * [`cmdmp3`](https://github.com/jimlawless/cmdmp3)
* `player` – Audio player to use (skips availability checks)

## Prior art

* [play.js](https://github.com/Marak/play.js) - play sound files from node.js to your speakers

## License

MIT
