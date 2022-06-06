const express = require('express');
const router = express.Router();
const authControl = require('../controllers/auth')


router.post('/signup', authControl.signupAuthentification);
router.post('/login', authControl.loginAuthentification);


module.exports = router;