var expect = require('expect.js')
  , sinon  = require('sinon')
  , mock       = require('mock-fs')

describe('mplayer has the maximum priority', function(){
  var command, spy, cli

  beforeEach(function(){
    command = "mplayer beep.mp3"
    , spy   = sinon.stub()
    , cli   = require('./')({ child_process: { exec: spy }})

    mock({'./beep.mp3': ''})
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

  afterEach(function(){
    mock.restore()
  })
})

describe('error handling', function(){
  it("throws errors if the file doesn't exist", function(){
    var spy   = sinon.stub()
      , cli = require('./')({ child_process: { exec: spy }})

    expect(function(args) { cli.play(args) }).withArgs("beep.mp3").
      to.throwException(/File doesn't exist: beep.mp3/)
  })

  it("throws errors if suitable audio tool couldn't be found", function(){
    mock({'./beep.mp3': ''})

    var cli = require('./')({ player: null })

    expect(function (args) { cli.play(args) }).withArgs("beep.mp3").
      to.throwException(/Couldn't find a suitable audio player/)
    mock.restore()
  })

  it("emits errors", function(){
    var spy = sinon.stub()
      , cli = require('./')()

    cli.on("error", spy)

    cli.play("beep.mp3")
    expect(spy.calledOnce).to.be(true)
  })
})

describe("overridable options", function(){
  it("supports overrides for the list of players", function(){
    var cli = require('./')({players: ["foo", "bar"], child_process: {}})
    expect(cli.players).to.eql(["foo", "bar"])
  })

  it("supports override for child_process", function(){
    var child_process = {}
    var cli = require('./')({child_process: child_process})
    expect(cli.child_process).to.eql(child_process)
  })

  it("supports override for player", function(){
    var cli = require('./')({player: "foo", child_process: {}})
    expect(cli.player).to.eql("foo")
  })

  it("player has precedence over players", function(){
    var spy = sinon.stub()
      , cli = require('./')({ child_process: { exec: spy }, player: "foo"})
    mock({"beep.mp3": ""})

    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith("foo beep.mp3")).to.be(true)
  })
})
