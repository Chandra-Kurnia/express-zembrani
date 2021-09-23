const express = require('express');
const vehicleController = require('../controller/vehicle');
const vehicleValidatons = require('../validations/vehicleValidatons');
const resultOftValidation = require('../validations/validationResult');
const imgValidation = require('../validations/imgValidation');
const { Auth, Role } = require('../middlewares/auth');

const router = express.Router();

router
  .get('/', vehicleController.getVechile)
  .get('/:id', vehicleController.showVehicle)
  .get('/4/popular', vehicleController.getPopular)
  .get('/addtohomepage/:id', vehicleController.addtohomepage)
  .get('/removefromhomepage/:id', vehicleController.removefromhomepage)
  .post(
    '/',
    imgValidation.convertImgVehicle,
    vehicleValidatons.createVehicleFieldRules(),
    (req, res, next) => {
      console.log(req.body);
      next();
    },
    resultOftValidation,
    Auth,
    Role('admin'),
    vehicleController.addVehicle,
  )
  .post('/:id', Auth, Role('admin'), vehicleValidatons.updateVehicleFieldRules(), resultOftValidation, vehicleController.updateVehicle)
  .post('/R/rental/', Auth, vehicleValidatons.rentalVehicleFieldRules(), resultOftValidation, vehicleController.rental)
  .delete('/:id', Auth, Role('admin'), vehicleController.deleteVehicle);
module.exports = router;
