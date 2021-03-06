/**
 * API Routes to create tax object and get bill from logged in user
 * 
 * @author Robert Arifin <arifinrobert2013@gmail.com>
 */
const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController.js');
const auth = require('../middlewares/auth.js');

router.post('/', auth.isLogin, taxController.createTax);
router.get('/', auth.isLogin, taxController.getUserBill);

module.exports = router;
