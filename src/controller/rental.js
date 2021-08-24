import {response, responseError} from '../helpers/helpers.js';
import rentalModel from '../models/rental.js';
import historyModel from '../models/history.js';

const updateRental = async (req, res, next) => {
  const {rental_id, status} = req.body;
  const resDataRental = await historyModel.showHistory(rental_id);
  const {quantity} = resDataRental[0];
  rentalModel
    .updateRental(rental_id, status)
    .then(() => {
      if (status === 'returned' || status === 'canceled') {
        rentalModel
          .updateVehicle(quantity)
          .then(() => {
            response(res, 'Success', 200, 'Successfully updated status rental & data vehicle');
          })
          .catch((err) => {
            responseError(res, 'Error', 500, 'Failed update vehicle when update data rental', err);
          });
      } else {
        response(res, 'Success', 200, 'Successfully updated data rental');
      }
    })
    .catch((err) => {
      responseError(res, 'Error', 500, 'Failed updated data rental', err);
    });
};

export default {
  updateRental,
};
