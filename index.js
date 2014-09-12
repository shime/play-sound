var fs               = require('fs')
  , util             = require('util')
  , EventEmitter     = require('events').EventEmitter
  , findExec         = require('find-exec')
  , child_process    = require('child_process')
  , players          = [
                        'mplayer',
                        'afplay',
                        'mpg123',
                        'mpg321',
                        'play'
                       ]

util.inherits(Play, EventEmitter)

function Play(opts){
  var opts           = opts               || {}

  this.players       = opts.players       || players
  this.player        = opts.player        || findExec(this.players)

  var exec           = child_process.exec

  this.play = function(what){
    if (!what) return;
    if (!fs.existsSync(what)) this.emit('error', new Error("File doesn't exist: " + what))

    var self = this

    if (!this.player){
      this.emit("error", new Error("Couldn't find a suitable audio player"))
      return
    }

    exec(this.player + ' ' + what, function(err, stdout, stderr){
      if (err) self.emit("error", err)
    })
  }
}

module.exports = function(opts){
  return new Play(opts)
}
