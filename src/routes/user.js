const express = require('express');
const resultOftValidation = require('../validations/validationResult');
const userController = require('../controller/user');
const userValidations = require('../validations/userValidations');
const checktoken = require('../middlewares/checkToken');
const { Auth } = require('../middlewares/auth');

const router = express.Router();

router
  .post('/register', userValidations.fieldRegisterRules(), resultOftValidation, userController.register)
  .get('/activation/:token', checktoken.checkTokenActivation, userController.activationAccount)
  .post(
    '/forgotpassword',
    userValidations.fieldForgotPasswordRules(),
    resultOftValidation,
    userController.forgotPassword,
  )
  .get('/checktokenforgotpassword/:token', checktoken.checkTokenForgotPassword, userController.checkTokenForgotPassword)
  .post(
    '/changepassword/:token',
    userValidations.fieldChangePasswordRules(),
    resultOftValidation,
    checktoken.checkTokenForgotPassword,
    userController.changePassword,
  )
  .post('/login', userValidations.fieldLoginRules(), resultOftValidation, userController.login)
  .get('/checktoken', Auth, userController.responseDataUser)
  .post('/updateprofile', userValidations.fieldUpdateRules(), Auth, userController.updateProfile)
  .get('/logout', userController.logout);
module.exports = router;
