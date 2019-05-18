var fs               = require('fs')
  , findExec         = require('find-exec')
  , spawn            = require('child_process').spawn
  , players          = [
                        'mplayer',
                        'afplay',
                        'ffplay',
                        'mpg123',
                        'mpg321',
                        'play',
                        'omxplayer',
                        'aplay',
                        'cmdmp3'
                       ]

var defaultOptions = {
  ffplay: ['-nodisp', '-autoexit']
}

function Play(opts){
  opts               = opts               || {}

  this.players       = opts.players       || players
  this.player        = opts.player        || findExec(this.players)
  this.urlRegex      = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i
  // Regex by @stephenhay from https://mathiasbynens.be/demo/url-regex

  this.play = function(what, options, next){
    next  = next || function(){}
    next  = typeof options === 'function' ? options : next
    options = Object.assign(defaultOptions, typeof options === 'object' ? options : {})
    options.stdio = 'ignore'

    if (!what) return next(new Error("No audio file specified"))

    if (!this.player || this.urlRegex.test(what) && this.player !== 'mplayer') {
      return next(new Error("Couldn't find a suitable audio player"))
    }

    var args = Array.isArray(options[this.player]) ? options[this.player].concat(what) : [what]
    var process = spawn(this.player, args, options)
    if (!process) {
      next(new Error("Unable to spawn process with " + this.player))
      return null
    }
    process.on('close',function(err){ next(err && !err.killed ? err : null) })
    return process
  }

  this.test = function(next) { this.play('./assets/test.mp3', next) }
}

module.exports = function(opts){
  return new Play(opts)
}
