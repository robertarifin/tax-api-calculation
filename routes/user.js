/**
 * API routes to sign in and sign up for user
 * 
 * @author Robert Arifin <arifinrobert2013@gmail.com>
 */
const router = require('express').Router();
const userController = require('../controllers/userController.js');

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);

module.exports = router