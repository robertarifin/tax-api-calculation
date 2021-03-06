/**
 * Helper function that is used to delete tax object
 * 
 * @author Robert Arifin <arifinrobert2013@gmail.com>
 */

const { Tax } = require('../models/index.js');

module.exports = {
  delete(done) {
    Tax.destroy({
      where: {
        name: ['test tax', 'test tax 1', 'test tax 2']
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