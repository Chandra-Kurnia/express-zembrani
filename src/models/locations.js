import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const getlocations = () =>
  new Promise((resolve, reject) => {
    connection.query('SELECT * FROM locations', (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

export default {
  getlocations,
};
