var expect = require('expect.js')
  , sinon  = require('sinon')


describe('cvlc has the maximum priority', function(){
  it('tries to play with cvlc first', function(){
    var command = "cvlc beep.mp3"
      , spy     = sinon.stub()

    var cli = require('./')({ child_process: {
      exec: spy
    }})
    spy.callsArg(1)

    cli.play("beep.mp3")

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith(command)).to.be(true)
    expect(cli.player).to.be('cvlc')
  })

  it("doesn't try to play anything if nothing is passed", function(){
    var command = "cvlc beep.mp3"
      , spy     = sinon.spy()

    var cli = require('./')({ child_process: spy})
    cli.play()

    expect(spy.called).to.not.be(true)
  })

  it("fallbacks to other players if it's not available", function(){
    var command = "cvlc beep.mp3"
      , spy     = sinon.stub()

    var cli = require('./')({ child_process: {
      exec: spy
    }})
    spy.callsArg(1)
    spy.withArgs("cvlc beep.mp3").callsArgWith(1, "cvlc: command not found")

    cli.play("beep.mp3")
    expect(cli.player).to.be("mplayer")
  })
})

describe('error handling', function(){
  it("throws errors if file doesn't exist")
  it("throws errors if suitable audio tool couldn't be found")
})
