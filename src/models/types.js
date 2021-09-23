const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const gettypes = () => new Promise((resolve, reject) => {
  connection.query('SELECT * FROM types', (err, result) => {
    promiseResolveReject(resolve, reject, err, result);
  });
});

module.exports = {
  gettypes,
};
