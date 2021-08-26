import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const getallhistory = (user_id) =>
  new Promise((resolve, reject) => {
    if (user_id === 1) {
      connection.query(
        `SELECT rentals.rental_id, rentals.cost, rentals.status, rentals.start_date, rentals.return_date, vehicles.vehicle_id, vehicles.vehicle_name, vehicles.image from rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id WHERE deletedByAdmin = '0' order by rental_id desc`,
        (err, result) => {
          promiseResolveReject(resolve, reject, err, result);
        }
      );
    } else {
      connection.query(
        `SELECT rentals.rental_id, rentals.cost, rentals.status, rentals.start_date, rentals.return_date, vehicles.vehicle_id, vehicles.vehicle_name, vehicles.image from rentals INNER JOIN vehicles ON rentals.vehicle_id = vehicles.vehicle_id WHERE deletedByUser = '0' AND user_id = ${user_id} order by rental_id desc`,
        (err, result) => {
          promiseResolveReject(resolve, reject, err, result);
        }
      );
    }
  });

const showHistory = (rental_id) =>
  new Promise((resolve, reject) => {
    connection.query(
      `select rentals.rental_id, vehicles.vehicle_id, vehicles.vehicle_name, vehicles.image, (select locations.location_name from locations inner join vehicles on locations.location_id = vehicles.location_id where vehicle_id = rentals.vehicle_id) as location_name, (select types.type_name from types inner join vehicles on vehicles.type_id = types.type_id where vehicle_id = rentals.vehicle_id) as vehicle_type, vehicles.price, rentals.quantity, rentals.cost, rentals.start_date, rentals.status,rentals.return_date, users.name, users.phone_number, users.email  from rentals inner join vehicles on rentals.vehicle_id = vehicles.vehicle_id inner join users on rentals.user_id = users.user_id where rental_id = ${rental_id}`,
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result);
      }
    );
  });

const deleteHistory = (rental_id, deleteBy) =>
  new Promise((resolve, reject) => {
    connection.query(`update rentals set ${deleteBy} = '1' where rental_id = ${rental_id}`, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });
export default {
  getallhistory,
  showHistory,
  deleteHistory,
};
