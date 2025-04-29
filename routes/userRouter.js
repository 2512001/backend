const express = require('express');
const { login, register, logout, updateUser } = require('../controller/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/login' , login);
router.post('/register' , register);
router.post('/logout' , authMiddleware , logout);
router.patch('/:id' , authMiddleware , updateUser);


module.exports = router;