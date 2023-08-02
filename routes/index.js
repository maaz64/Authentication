const express = require('express');
const router = express.Router();

const authController = require('../Controller/authController');
const isAuth = require('../Config/middleware');


router.get('/',authController.Home);
router.get('/profile',isAuth,authController.Profile);
router.get('/register',authController.Register);
router.get('/login',authController.Login);


router.post('/register',authController.createUser);
router.post('/login',authController.userLogin);
router.post('/logout',authController.userLogout);



module.exports = router;