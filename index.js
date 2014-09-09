var fs               = require('fs')
  , defaultPlayers   = [
                        'cvlc',
                        'afplay',
                        'mplayer',
                        'mpg123',
                        'mpg321',
                        'play'
                       ]

function Play(opts){
  var opts           = opts || {}

  this.players       = opts.players || defaultPlayers
  this.child_process = opts.child_process || child_process
  this.player        = opts.player

  var exec           = this.child_process.exec

  this.play = function(what){
    if (!what) return;
    if (!fs.existsSync(what)) throw new Error("Couldn't find file: " + what)

    var players = this.players,
        self    = this

    for(i = 0; i < players.length; i++){
      var player         = self.player || players[i]

      exec(player + ' ' + what, function(err, stdout, stderr){
        if (err && i == (players.length - 1))
          throw new Error("Couldn't find a suitable audio player")

        if (!err){
          self.player = player
        }
      })

      if (self.player) break
    }
  }
}

module.exports = function(opts){
  return new Play(opts)
}
