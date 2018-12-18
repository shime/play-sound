var expect     = require('expect.js')
  , sinon      = require('sinon')
  , mock       = require('mock-fs')
  , proxyquire = require('proxyquire').noPreserveCache()

describe('mplayer has the maximum priority', function(){
  var spy, cli

  beforeEach(function(){
    spy = sinon.stub()
    cli = proxyquire('./', { child_process: { spawn: spy }})()

    mock({
      './beep.mp3': '',
      'mplayer': mock.file({
        mode: 0755
      })
    })
  })

  it('tries to play with mplayer first', function(){
    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith("mplayer", ["beep.mp3"])).to.be(true)
    expect(cli.player).to.be('mplayer')
  })

  it("doesn't try to play anything if nothing is passed", function(){
    cli.play()

    expect(spy.called).to.not.be(true)
  })

  afterEach(mock.restore)
})

describe('error handling', function(){
  it("throws errors if suitable audio tool couldn't be found", function(done){
    var cli = require('./')({ players: [] })

    mock({"beep.mp3": ""})
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
      , cli = proxyquire('./', { child_process: { spawn: spy }})({player: "foo"})
    mock({"beep.mp3": ""})

    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith("foo", ["beep.mp3"])).to.be(true)
  })

  it("takes player arguments", function(){
    var spy = sinon.stub()
      , cli = proxyquire('./', { child_process: { spawn: spy }})({player: "afplay"})
    mock({"beep.mp3": ""})

    cli.play("beep.mp3", { afplay: ["-v", 2] })

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith("afplay", ["-v", 2, "beep.mp3"])).to.be(true)
  })

  it("returns the child_process instance", function(){
    var returnInstance = {on: function() {}}
      , spy = sinon.stub().returns(returnInstance)
      , cli = proxyquire('./', { child_process: { spawn: spy }})({player: "foo"})
    mock({"beep.mp3": ""})

    var response = cli.play("beep.mp3")

    expect(response).to.equal(returnInstance)
  })

  afterEach(mock.restore)
})

if (!process.env.CI){
  it("provides a function for easy testing", function(done){
      var player = require('./')()
      player.test(function(){
        done()
      })
  })
}
