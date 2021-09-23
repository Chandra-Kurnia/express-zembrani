const express = require('express');
const rentalController = require('../controller/rental');
const rentalValidation = require('../validations/rentalValidation');
const resultOftValidation = require('../validations/validationResult');

const router = express.Router();

router.post(
  '/updaterental',
  rentalValidation.updateRentalFieldRules(),
  resultOftValidation,
  rentalController.updateRental,
);
module.exports = router;
