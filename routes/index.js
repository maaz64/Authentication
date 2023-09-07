const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../Controller/authController');
const isAuth = require('../Config/middleware');


router.get('/',authController.Home);
router.get('/profile',isAuth,authController.Profile);
router.get('/register',authController.Register);
router.get('/login',authController.Login);
router.get('/auth/google',passport.authenticate('google',{scope:['profile', 'email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/login'}), authController.userLogin)

router.post('/register',authController.createUser);
router.post('/login',authController.userLogin);
router.post('/logout',authController.userLogout);



module.exports = router;