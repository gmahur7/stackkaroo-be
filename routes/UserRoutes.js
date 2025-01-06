const express = require('express');
const { loginUser, registerUser } = require('../controllers/UserControllers');
const router = express.Router();

// User registration route
router.post('/register',registerUser);

// User login route
router.post('/login',loginUser);

// Update user route
router.put('/update/:id',);

// Delete user route
router.delete('/delete/:id', );

module.exports = router;