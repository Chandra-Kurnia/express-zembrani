import {response, responseError} from '../helpers/helpers.js';
import typeModel from '../models/types.js';

const gettypes = async (req, res, next) => {
  try {
    const types = await typeModel.gettypes();
    response(res, 'Success', 200, 'All data succesfully loaded', types);
  } catch (error) {
    next(error);
  }
};

export default {
  gettypes,
};
