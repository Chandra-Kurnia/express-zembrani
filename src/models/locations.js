import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const getlocations = (keyword) =>
  new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM locations WHERE location_name like '%${keyword}%'`, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

export default {
  getlocations,
};
