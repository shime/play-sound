var expect     = require('expect.js')
  , sinon      = require('sinon')
  , mock       = require('mock-fs')
  , proxyquire = require('proxyquire').noPreserveCache()

describe('mplayer has the maximum priority', function(){
  var command, spy, cli

  beforeEach(function(){
    command = "mplayer beep.mp3"
    , spy   = sinon.stub()
    , cli   = proxyquire('./', { child_process: { exec: spy }})()

    mock({
      './beep.mp3': '',
      'mplayer': mock.file({
        mode: 0755
      })
    })
  })

  it('tries to play with mplayer first', function(){
    spy.callsArg(1)

    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith(command)).to.be(true)
    expect(cli.player).to.be('mplayer')
  })

  it("doesn't try to play anything if nothing is passed", function(){
    cli.play()

    expect(spy.called).to.not.be(true)
  })

  afterEach(mock.restore)
})

describe('error handling', function(){
  it("throws errors if the file doesn't exist", function(done){
    var spy    = sinon.stub(),
        player = proxyquire('./', { child_process: {exec: spy}})({ player: 'mplayer'})

    spy.callsArgWith(1, undefined, undefined, "file doesn't exist")

    player.play('beep.mp3', function(err){
      expect(err.message).to.be("File doesn't exist: beep.mp3")
      done()
    })
  })

  it("throws errors if suitable audio tool couldn't be found", function(done){
    var cli = require('./')({ players: [] })

    cli.play("beep.mp3", function(err){
      expect(err.message).to.be("Couldn't find a suitable audio player")
      done()
    })
  })

  afterEach(mock.restore)
})

describe("overridable options", function(){
  it("supports overrides for the list of players", function(){
    var cli = require('./')({players: ["foo", "bar"]})
    expect(cli.players).to.eql(["foo", "bar"])
  })

  it("supports override for player", function(){
    var cli = require('./')({player: "foo"})
    expect(cli.player).to.eql("foo")
  })

  it("player has precedence over players", function(){
    var spy = sinon.stub()
      , cli = proxyquire('./', { child_process: { exec: spy }})({player: "foo"})
    mock({"beep.mp3": ""})

    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith("foo beep.mp3")).to.be(true)
  })

})

if (!process.env.CI){
  it("provides a function for easy testing", function(done){
      var player = require('./')()
      player.test(function(){
        done()
      })
  })
}
