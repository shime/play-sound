var fs               = require('fs')
  , findExec         = require('find-exec')
  , spawn            = require('child_process').spawn
  , players          = [
                        'mplayer',
                        'afplay',
                        'mpg123',
                        'mpg321',
                        'play',
                        'omxplayer',
                        'aplay',
                        'cmdmp3'
                       ]

function Play(opts){
  opts               = opts               || {}

  this.players       = opts.players       || players
  this.player        = opts.player        || findExec(this.players)
  this.urlRegex      = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i
  // Regex by @stephenhay from https://mathiasbynens.be/demo/url-regex

  this.play = function(what, options, next){
    next  = next || function(){}
    next  = typeof options === 'function' ? options : next
    options = typeof options === 'object' ? options : {}
    options.stdio = 'ignore'

    var isURL = this.player == 'mplayer' && this.urlRegex.test(what)

    if (!what) return next(new Error("No audio file specified"))

    if (!this.player){
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

module.exports.play = function(what, options, next) {
  if (!next && typeof options !== 'function') {
    var player = new Play(options)
    return new Promise(function(resolve, reject) {
      player.play(what, options, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  } else {
    return new Play(typeof options === 'object' ? options : {}).play(what, options, next)
  }
}
