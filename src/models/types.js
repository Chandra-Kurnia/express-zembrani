import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const gettypes = () =>
  new Promise((resolve, reject) => {
    connection.query('SELECT * FROM types', (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

export default {
  gettypes,
};
