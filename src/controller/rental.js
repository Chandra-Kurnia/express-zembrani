/* eslint-disable camelcase */
const { response, responseError } = require('../helpers/helpers');
const rentalModel = require('../models/rental');
const historyModel = require('../models/history');

const updateRental = async (req, res) => {
  const { rental_id, status } = req.body;
  const resDataRental = await historyModel.showHistory(rental_id);
  const { quantity, vehicle_id } = resDataRental[0];
  rentalModel
    .updateRental(rental_id, status)
    .then(() => {
      if (status === 'returned' || status === 'canceled') {
        rentalModel
          .updateVehicle(quantity, vehicle_id)
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

module.exports = {
  updateRental,
};
