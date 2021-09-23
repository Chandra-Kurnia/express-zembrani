const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const getlocations = (keyword) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM locations WHERE location_name like '%${keyword}%'`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

module.exports = {
  getlocations,
};
