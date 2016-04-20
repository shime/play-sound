var fs               = require('fs')
  , findExec         = require('find-exec')
  , child_process    = require('child_process')
  , players          = [
                        'mplayer',
                        'afplay',
                        'mpg123',
                        'mpg321',
                        'play',
                        'omxplayer'
                       ]

function Play(opts){
  opts               = opts               || {}

  this.players       = opts.players       || players
  this.player        = opts.player        || findExec(this.players)
  this.urlRegex      = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i
  // Regex by @stephenhay from https://mathiasbynens.be/demo/url-regex

  this.play = function(what, next){
    next  = next || function(){}
    var isURL = this.player == 'mplayer' && this.urlRegex.test(what)

    try {
      isFile = fs.statSync(what).isFile()
    } catch (err){
      isFile = false
    }

    if (!what) return next(new Error("No audio file specified"));

    if (!isURL && !isFile){
      return next(new Error(what + " is not a file or URL"))
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
