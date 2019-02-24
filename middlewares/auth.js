/**
 * Function  to check if the authorization token is valid 
 * 
 * @author Robert Arifin<arifinrobert2013@gmail.com>
 */

const jwt = require('../helpers/token.js');
const { User } = require('../models/index.js');

module.exports = {
  /**
   * isLogin function is a middleware that check if the authorization token is valid or not before going to the controller
   * 
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  isLogin(req, res, next) {
    if (req.headers.authorization.includes('Bearer ')) {
      let decodedData = jwt.verifyToken(req.headers.authorization.substr(7));
      User.findOne({
        where: {
          email: decodedData.email
        }
      })
        .then((data) => {
          if (data) {
            req.user = decodedData
            next()
          } else {
            res.status(400).json({
              info: 'User does not exist anymore'
            })
          }
        })
        .catch((err) => {
          res.status(500).json({
            info: 'Please try again later!'
          })
        })
    } else {
      console.l
      res.status(404).json({
        info: 'Failed to login',
        err: "Invalid token"
      })
    }
  } 
}