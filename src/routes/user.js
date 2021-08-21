import express from 'express';
import resultOftValidation from '../validations/validationResult.js';
import userController from '../../src/controller/user.js'
import userValidations from '../validations/userValidations.js';

const router = express.Router();

router.post('/register', userValidations.fieldRegisterRules(), resultOftValidation, userController.register);
export default router;
