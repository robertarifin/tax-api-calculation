const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
  hashPassword(password) {
    return bcrypt.hashSync(password, salt)
  },

  comparePassword(inputPassword, dbPassword) {
    return bcrypt.compareSync(inputPassword, dbPassword)
  }
}