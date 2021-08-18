import {body} from 'express-validator';

const createVehicleFieldRules = () => [
  body('location_id').notEmpty().withMessage('Location Id is empty !'),
  body('type_id').notEmpty().withMessage('Type id is empty !'),
  body('vehicle_name').notEmpty().withMessage('Please input your vehicle name'),
  body('price')
    .notEmpty()
    .withMessage('Please insert your vehicle price / day')
    .bail()
    .isNumeric()
    .withMessage('Invalid input for your vehicle price'),
  body('status')
    .notEmpty()
    .withMessage('Please select vehicle status')
    .bail()
    .isIn(['avaiable', 'fullBooked'])
    .withMessage('vehicle status is wrong !'),
  body('stock')
    .notEmpty()
    .withMessage('Please insert your vehicle stock !')
    .bail()
    .isNumeric()
    .withMessage('Invalid input for your vehicle stock'),
  body('description').notEmpty().withMessage('Please type the vehicle descripton'),
  body('vehicle_img')
    .notEmpty()
    .withMessage('Please attach a picture of your vehicle')
    .bail()
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('image must be jpg/jpeg or png');
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (parseInt(value.size, 10) > 5242880) {
        throw new Error('image size exceeds 2 megabytes');
      }
      return true;
    }),
];

const updateVehicleFieldRules = () => [
  body('location_id').notEmpty().withMessage('Location Id is empty !'),
  body('type_id').notEmpty().withMessage('Type id is empty !'),
  body('vehicle_name').notEmpty().withMessage('Please input your vehicle name'),
  body('price')
    .notEmpty()
    .withMessage('Please insert your vehicle price / day')
    .bail()
    .isNumeric()
    .withMessage('Invalid input for your vehicle price'),
  body('status')
    .notEmpty()
    .withMessage('Please select vehicle status')
    .bail()
    .isIn(['avaiable', 'fullBooked'])
    .withMessage('vehicle status is wrong !'),
  body('stock')
    .notEmpty()
    .withMessage('Please insert your vehicle stock !')
    .bail()
    .isNumeric()
    .withMessage('Invalid input for your vehicle stock'),
  body('description').notEmpty().withMessage('Please type the vehicle descripton'),
];

export default {
  createVehicleFieldRules,
  updateVehicleFieldRules,
};
