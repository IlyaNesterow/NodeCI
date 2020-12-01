const Keygrip = require('keygrip')
const keys = require('../../config/keys')
const buf = require('safe-buffer').Buffer

const keygrip = new Keygrip([keys.cookieKey])

module.exports = _ => {
  const sessionObject = {
    passport : {
      user: '5fc1054200391e252042321a'
    }
  }
  const session = buf.from(
    JSON.stringify(sessionObject)
  ).toString('base64')
    
  const sig = keygrip.sign('express:sess=' + session)

  return { session, sig }
}