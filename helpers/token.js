const jwt = require('jsonwebtoken')

module.exports = {
  generateToken(userData) {
    return jwt.sign(userData, process.env.SECRET)
  },

  verifyToken(token) {
    return jwt.verify(token, process.env.SECRET)
  }
}