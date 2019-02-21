const { User } = require('../models/index.js');
const password = require('../helpers/password.js');
const jwt = require('../helpers/token.js');

module.exports= {
  signUp(req,res) {
    let data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    User.create(data)
      .then(({ dataValues }) => {
        delete dataValues.password
        res.status(201).json({
          data: dataValues,
          info: "Successfully create user"
        })
      })
      .catch((err) => {
        if (err.errors) {
          const { errors } = err;
          let errorMessage = "";
          errors.forEach((error) => {
            errorMessage += error.message + ","
          })
  
          errorMessage = errorMessage.substring(0, errorMessage.length - 1)
  
          res.status(400).json({
           info: "Failed to create user data",
           err:   errorMessage
         })
        } else {
          res.status(500).json({
            info: 'Failed to create user data',
            err: 'Please try again later!'
          })
        }
      })
  },

  signIn(req, res) {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then((data) => {
        if (data) {
            const { dataValues } = data;
            let passwordMatch = password.comparePassword(req.body.password, dataValues.password)

            if (passwordMatch) {
              delete dataValues.password
              res.status(200).json({
                info: 'User successfully sign in',
                token: jwt.generateToken(dataValues) 
              })
            } else {
              res.status(404).json({
                info: 'User failed to sign in',
                err: 'Password is incorrect'
              })
            }
        } else {
          res.status(404).json({
            info: `User failed to sign in`,
            err: `User doesn't exist`
          })
        }
      })
      .catch((err) => {
        res.status(500).json({
          info: 'User failed to sign in',
          err: 'Please try again later!'
        })
      })
  }
}