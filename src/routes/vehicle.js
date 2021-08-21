import express from 'express';
import vehicleController from '../controller/vehicle.js';
import vehicleValidatons from '../validations/vehicleValidatons.js';
import resultOftValidation from '../validations/validationResult.js'
import imgValidation from '../validations/imgValidation.js';

const router = express.Router();

router
  .get('/', vehicleController.getVechile)
  .get('/:id', vehicleController.showVehicle)
  .get('/4/popular', vehicleController.getPopular)
  .post('/', imgValidation.convertImgVehicle,vehicleValidatons.createVehicleFieldRules(), resultOftValidation ,vehicleController.addVehicle)
  .post('/:id', vehicleValidatons.updateVehicleFieldRules(), resultOftValidation, vehicleController.updateVehicle)
  .delete('/:id', vehicleController.deleteVehicle);
export default router;
