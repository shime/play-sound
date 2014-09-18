var fs               = require('fs')
  , util             = require('util')
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
  var opts           = opts               || {}

  this.players       = opts.players       || players
  this.player        = opts.player        || findExec(this.players)

  var exec           = child_process.exec

  this.play = function(what, next){
    var self = this,
        next = next || function(){}

    if (!what) return next();

    if (!this.player){
      return next(new Error("Couldn't find a suitable audio player"))
    }

    exec(this.player + ' ' + what, function(err, stdout, stderr){
      if (err) next(err)
      if (stderr) next(new Error("File doesn't exist: " + what))
    })
  }

  this.test = function(next) { this.play('./assets/test.mp3', next) }
}

module.exports = function(opts){
  return new Play(opts)
}
