const express = require('express');
const router = express.Router();
const usersControl = require('../controllers/users');
const auth = require('../middlewares/auth')

router.get('/:userId', auth, usersControl.getUser)
router.put('/:userId', auth, usersControl.modifyUser)
router.put('/:userId/password', auth, usersControl.modifyPassword)
router.delete('/:userId', auth, usersControl.deleteUser)

module.exports = router;