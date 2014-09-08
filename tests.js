var expect = require('expect.js')
  , sinon  = require('sinon')


describe('cvlc has the maximum priorty', function(){
  it('tries to play with cvlc first', function(){
    var command = "cvlc beep.mp3"
      , spy     = sinon.spy()

    var cli = require('./')({ child_process: {
      exec: spy
    }})

    cli.play('beep.mp3')

    expect(spy.calledOnce).to.be(true)
    expect(spy.calledWith(command)).to.be(true)
  })

  it("doesn't try to play anything if nothing is passed", function(){
    var command = "cvlc beep.mp3"
      , spy     = sinon.spy()

    var cli = require('./')({ child_process: spy})
    cli.play()

    expect(spy.called).to.not.be(true)
  })

  it("doesn't error out if it's not available")
})

it('fallbacks to other players')

describe('errors', function(){
})
