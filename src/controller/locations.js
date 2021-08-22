import {response, responseError} from '../helpers/helpers.js';
import locationsModel from '../models/locations.js';

const getlocations = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || ''
    const locations = await locationsModel.getlocations(keyword);
    if (locations.length > 0) {
      response(res, 'Success', 200, 'All data succesfully loaded', locations);
    } else {
      response(res, 'Not found', 200, 'Data locations not found');
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getlocations,
};
