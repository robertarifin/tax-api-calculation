const jwt = require('../helpers/token.js');
const { User } = require('../models/index.js');

module.exports = {
  isLogin(req, res, next) {
    if (req.headers.token) {
      let decodedData = jwt.verifyToken(req.headers.token);
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
      res.status(404).json({
        info: 'Failed to login',
        err: "Token doesn't exist"
      })
    }
  } 
}