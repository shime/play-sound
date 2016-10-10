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

  this.play = function(what, options, next){
    next  = next || function(){}
    next  = typeof(options) === 'function' ? options : next
    var isURL = this.player == 'mplayer' && this.urlRegex.test(what)

    if (!what) return next(new Error("No audio file specified"));

    if (!this.player){
      return next(new Error("Couldn't find a suitable audio player"))
    }

    child_process.execFile(this.player, [what], options, function(err, stdout, stderr){
      next(err && !err.killed ? err : undefined);
    })
  }

  this.test = function(next) { this.play('./assets/test.mp3', next) }
}

module.exports = function(opts){
  return new Play(opts)
}
