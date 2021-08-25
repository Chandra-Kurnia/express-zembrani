import express from 'express';
import resultOftValidation from '../validations/validationResult.js';
import userController from '../../src/controller/user.js';
import userValidations from '../validations/userValidations.js';
import checktoken from '../middlewares/checkToken.js';
import {Auth} from '../middlewares/auth.js'

const router = express.Router();

router
  .post('/register', userValidations.fieldRegisterRules(), resultOftValidation, userController.register)
  .get('/activation/:token', checktoken.checkTokenActivation, userController.activationAccount)
  .post(
    '/forgotpassword',
    userValidations.fieldForgotPasswordRules(),
    resultOftValidation,
    userController.forgotPassword
  )
  .get('/checktokenforgotpassword/:token', checktoken.checkTokenForgotPassword, userController.checkTokenForgotPassword)
  .post(
    '/changepassword/:token',
    userValidations.fieldChangePasswordRules(),
    resultOftValidation,
    checktoken.checkTokenForgotPassword,
    userController.changePassword
  )
  .post('/login', userValidations.fieldLoginRules(), resultOftValidation, userController.login)
  .post('/checktoken', Auth, userController.responseDataUser)
export default router;
