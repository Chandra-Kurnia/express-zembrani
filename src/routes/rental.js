import express from 'express';
import rentalController from '../controller/rental.js';
import rentalValidation from '../validations/rentalValidation.js';
import resultOftValidation from '../validations/validationResult.js';

const router = express.Router();

router.post(
  '/updaterental',
  rentalValidation.updateRentalFieldRules(),
  resultOftValidation,
  rentalController.updateRental
);
export default router;
