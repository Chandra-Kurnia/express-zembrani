/* eslint-disable camelcase */
const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const updateRental = (rental_id, status) => new Promise((resolve, reject) => {
  connection.query(`update rentals set status = '${status}' where rental_id = ${rental_id}`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

const updateVehicle = (quantity, vehicle_id) => new Promise((resolve, reject) => {
  connection.query(
    `update vehicles set rented = rented - ${quantity}, remain = remain + ${quantity} WHERE vehicle_id = ${vehicle_id}`,
    (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    },
  );
});

module.exports = {
  updateRental,
  updateVehicle,
};
