const { response } = require('../helpers/helpers');
const typeModel = require('../models/types');

const gettypes = async (req, res, next) => {
  try {
    const types = await typeModel.gettypes();
    if (types.length > 0) {
      response(res, 'Success', 200, 'All data succesfully loaded', types);
    } else {
      response(res, 'Not found', 200, 'Data types not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  gettypes,
};
