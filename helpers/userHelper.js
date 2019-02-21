const { User } = require('../models/index.js');

module.exports = {
  create(done) {
    User.create({
      name: 'testing',
      email: 'testing@gmail.com',
      password: '1234'
    })
      .then((data) => {
        done()
      })
      .catch((err) => {
        done(err)
      })
  },

  delete(done) {
    User.destroy({
      where: {
        email: 'testing@gmail.com'
      }
    })
      .then((data) => {
        done()
      })
      .catch((err) => {
        done(err)
      })
  }
}