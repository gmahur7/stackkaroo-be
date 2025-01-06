const express = require('express');
const { loginUser, registerUser } = require('../controllers/UserControllers');
const {  resetLoginAttempts } = require('../middlewares/RateLimits');
const router = express.Router();

// User registration route
router.post('/register',registerUser);

// User login route
router.post('/login',loginUser);

// Update user route
router.put('/update/:id',);

// Delete user route
router.delete('/delete/:id', );

router.put('/reset/login',resetLoginAttempts);

module.exports = router;