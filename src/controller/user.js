import {response, responseError, responsePagination} from '../helpers/helpers.js';

const register = async (req, res, next) => {
  try {
    const {email, password, name} = req.body;
    const data = {
        email,
        password,
        name
    }
    response(res, 'Sucess', 200, 'Sampai controller', data);
  } catch {
    next(err);
  }
};

export default {
  register,
};
