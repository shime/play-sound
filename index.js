var fs               = require('fs')
  , path             = require('path')
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

    if (!what) {
      next(new Error("No audio file specified"))
      return null
    }

    try {
      fs.accessSync(what, fs.constants.R_OK)
    } catch (_) {
      next(new Error("Specified file can't be accessed"))
      return null
    }

    if (!this.player || this.urlRegex.test(what) && this.player !== 'mplayer') {
      next(new Error("Couldn't find a suitable audio player"))
      return null
    }

    var args = Array.isArray(options[this.player]) ? options[this.player].concat(what) : [what]

    var process = spawn(this.player, args, options)

    process.on('error', function(err) {
      if (!process.playerFinished) {
        process.playerFinished = true
        next(err)
      }
    })

    var player = this.player

    process.on('exit', function(code, signal) {
      if (!process.playerFinished) {
        process.playerFinished = true
        var err = new Error(player + " exited with " + (code || signal))
        err.code = code
        err.signal = signal
        err.killed = process.killed
        next(code !== 0 ? err : null, { code: code, signal: signal, killed: process.killed })
      }
    })

    return process
  }

  this.test = function(next) { this.play(path.join(__dirname, 'assets', 'test.mp3'), next) }
}

module.exports = function(opts){
  return new Play(opts)
}
