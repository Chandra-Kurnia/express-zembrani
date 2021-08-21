import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const getVehicle = (type, keyword, order = '', field = '', start = '', limit = '') =>
  new Promise((resolve, reject) => {
    if (order === '' && field === '' && start === '' && limit === '') {
      connection.query(
        `select vehicles.vehicle_id, types.type_id, locations.location_id, vehicles.vehicle_name, locations.location_name, types.type_name, vehicles.status, vehicles.description, vehicles.price, vehicles.stock, vehicles.image from vehicles inner join types on vehicles.type_id = types.type_id inner join locations on vehicles.location_id = locations.location_id WHERE (types.type_name = '${type}') AND (vehicles.vehicle_name like '%${keyword}%' OR locations.location_name like '%${keyword}%')`,
        (err, result) => {
          promiseResolveReject(resolve, reject, err, result);
        }
      );
    } else {
      connection.query(
        `select vehicles.vehicle_id, types.type_id, locations.location_id, vehicles.vehicle_name, locations.location_name, types.type_name, vehicles.status, vehicles.description, vehicles.price, vehicles.stock, vehicles.image from vehicles inner join types on vehicles.type_id = types.type_id inner join locations on vehicles.location_id = locations.location_id WHERE (types.type_name = '${type}') AND (vehicles.vehicle_name like '%${keyword}%' OR locations.location_name like '%${keyword}%') order by ${field} ${order} limit ${start},${limit}`,
        (err, result) => {
          promiseResolveReject(resolve, reject, err, result);
        }
      );
    }
  });

const showVehicle = (id) =>
  new Promise((resolve, reject) => {
    connection.query('SELECT vehicles.vehicle_id, vehicles.image, vehicles.vehicle_name, locations.location_id, vehicles.type_id, locations.location_name, vehicles.status, vehicles.description, types.type_name, vehicles.price, vehicles.stock from vehicles INNER JOIN locations ON vehicles.location_id = locations.location_id INNER JOIN types ON vehicles.type_id = types.type_id WHERE vehicle_id = ?', id, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const getPopular = () =>
  new Promise((resolve, reject) => {
    connection.query(
      'SELECT vehicles.vehicle_id, vehicles.image, vehicles.vehicle_name, locations.location_name, vehicles.count_rental from vehicles inner join locations on vehicles.location_id = locations.location_id order by vehicles.count_rental DESC limit 0,4;',
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result);
      }
    );
  });

const addVehicle = (data, image) =>
  new Promise((resolve, reject) => {
    connection.query('INSERT INTO vehicles SET ?', data, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const updateVehicle = (data, id) =>
  new Promise((resolve, reject) => {
    connection.query(`UPDATE vehicles SET ? WHERE vehicle_id = ${id}`, data, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const deleteVehicle = (id) =>
  new Promise((resolve, reject) => {
    connection.query('DELETE FROM vehicles WHERE vehicle_id = ?', id, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

export default {
  getVehicle,
  showVehicle,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getPopular,
};
