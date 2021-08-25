import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const updateRental = (rental_id, status) =>
  new Promise((resolve, reject) => {
    connection.query(`update rentals set status = '${status}' where rental_id = ${rental_id}`, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const updateVehicle = (quantity, vehicle_id) =>
  new Promise((resolve, reject) => {
    connection.query(
      `update vehicles set rented = rented - ${quantity}, remain = remain + ${quantity} WHERE vehicle_id = ${vehicle_id}`,
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result);
      }
    );
  });

export default {
  updateRental,
  updateVehicle,
};