# play-sound

[![Build Status](https://travis-ci.org/shime/play-sound.svg)](https://travis-ci.org/shime/play-sound)

Play sounds by shelling out to one of the available audio players.

## installation

    npm install play-sound

## examples

```javascript
var player = require('play-sound')(opts = {})
player.play('foo.mp3') // $ mplayer foo.mp3 
```

Options: 

* `players` - list of available audio players to check (default: `['mplayer', 'afplay', 'mpg123', 'mpg321', 'play']`)
* `player`  - audio player to use, skips availability checks

## prior art

[play.js](https://github.com/Marak/play.js) - play sound files from node.js to your speakers

## license

MIT

