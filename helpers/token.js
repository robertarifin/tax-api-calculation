/**
 * Functions that are used to generate authorizarion token and decode the token
 * 
 * @author Robert Arifin <arifinrobert2013@gmail.com>
 */
const jwt = require('jsonwebtoken')

module.exports = {
  /**
   * Function that return token based on user info and the secret 
   * 
   * @param {*} userData 
   */
  generateToken(userData) {
    return jwt.sign(userData, process.env.SECRET)
  },

  /**
   * Function that decode the token and return an object consist of user info from the token
   * 
   * @param {*} token 
   */
  verifyToken(token) {
    return jwt.verify(token, process.env.SECRET)
  }
}