const express=require('express');
const Router=express.Router();
const AuthenticationController= require('../Controller/authController')
const verifyAuth=require('../Middleware/authVerify')

// declaring the api routes/endpoints

// authentication routes
Router.post('/register',AuthenticationController.RegisterCreate)
Router.post('/login',AuthenticationController.Login)

// admin dashboard route
Router.get('/adminPanel',verifyAuth.verifyToken2, AuthenticationController.userList)

// user dashboard route
Router.get('/user/:userId', verifyAuth.verifyToken1, AuthenticationController.getUserDetails);


module.exports=Router