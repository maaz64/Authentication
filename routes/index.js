// importing required modules and files
const express = require('express');
const router = express.Router();
const passport = require('passport');

// importing authController
const authController = require('../Controller/authController');
const isAuth = require('../Config/middleware');

// creating the get routes
router.get('/',authController.Home);
router.get('/profile',authController.Profile);
router.get('/register',authController.Register);
router.get('/login',authController.Login);
router.get('/reset-password',authController.resetPasswordPage)
router.get('/auth/google',passport.authenticate('google',{scope:['profile', 'email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/login'}), authController.userLogin)

// creating post routes
router.post('/register',authController.createUser);
router.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),authController.userLogin);
router.post('/logout',authController.userLogout);
router.post('/change-password',authController.changePassword);


// exporting the router
module.exports = router;