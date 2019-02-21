/**
 * Functions to hash password before being stored in database and to 
 * compare password between input password and database password for a user
 * 
 * @author Robert Arifin <arifinrobert2013@gmail.com>
 */

const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
  /**
   * Function that return string of a hashed password
   * @param {*} password 
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, salt)
  },

  /**
   * Function that compare inpput password and db password that will return boolean if the password matched or not
   * @param {*} inputPassword 
   * @param {*} dbPassword 
   */
  comparePassword(inputPassword, dbPassword) {
    return bcrypt.compareSync(inputPassword, dbPassword)
  }
}