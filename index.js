var fs               = require('fs')
  , findExec         = require('find-exec')
  , child_process    = require('child_process')
  , players          = [
                        'mplayer',
                        'afplay',
                        'mpg123',
                        'mpg321',
                        'play'
                       ]

function Play(opts){
  opts               = opts               || {}

  this.players       = opts.players       || players
  this.player        = opts.player        || findExec(this.players)

  this.play = function(what, next){
    next = next || function(){}

    if (!what) return next(new Error("No audio file specified"));

    try {
      if (!fs.statSync(what).isFile()){
        return next(new Error(what + " is not a file"));
      }
    } catch (err){
      return next(new Error("File doesn't exist: " + what));
    }

    if (!this.player){
      return next(new Error("Couldn't find a suitable audio player"))
    }

    child_process.execFile(this.player, [what], function(err, stdout, stderr){
      next(err);
    })
  }

  this.test = function(next) { this.play('./assets/test.mp3', next) }
}

module.exports = function(opts){
  return new Play(opts)
}
