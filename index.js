function Play(opts){
  this.child_process = opts.child_process
  this.play = function(what){
    if (what) this.child_process.exec('cvlc ' + what)
  }
}
module.exports = function(opts){
  return new Play(opts)
}
