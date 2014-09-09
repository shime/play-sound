var expect = require('expect.js')
  , sinon  = require('sinon')
  , mock   = require('mock-fs')


describe('cvlc has the maximum priority', function(){
  var command, spy, cli;

  beforeEach(function(){
    command = "cvlc beep.mp3"
    , spy     = sinon.stub()
    , cli = require('./')({ child_process: { exec: spy }})

    mock({'./beep.mp3': ''})
  })

  it('tries to play with cvlc first', function(){
    spy.callsArg(1)

    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith(command)).to.be(true)
    expect(cli.player).to.be('cvlc')
  })

  it("doesn't try to play anything if nothing is passed", function(){
    cli.play()

    expect(spy.called).to.not.be(true)
  })

  it("fallbacks to other players if it's not available", function(){
    spy.callsArg(1)
    spy.withArgs("cvlc beep.mp3").callsArgWith(1, "cvlc: command not found")

    cli.play("beep.mp3")
    expect(cli.player).to.be("mplayer")
  })

  after(function(){
    mock.restore()
  })
})

describe('error handling', function(){
  it("throws errors if the file doesn't exist", function(){
    var stub = sinon.stub()
      , cli  = require('./')({ child_process: {exec: stub}})

    expect(cli.play).withArgs("beep.mp3").to.throwException()
  })

  it("throws errors if suitable audio tool couldn't be found")
})

describe("overridable options", function(){
  it("supports overrides for the list of players")
  it("supports override for child_process")
  it("supports override for player")
})
