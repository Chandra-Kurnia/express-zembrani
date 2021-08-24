import {response, responseError} from '../helpers/helpers.js';
import historyModel from '../models/history.js';

const getHistory = async (req, res, next) => {
  try {
    const user_id = 20;
    const histories = await historyModel.getallhistory(user_id);
    if (histories.length > 0) {
      response(res, 'Success', 200, 'All history successfully loaded', histories);
    } else {
      response(res, 'Not found', 200, 'Data not found');
    }
  } catch (err) {
    next(err);
  }
};

const showHistory = async (req, res, next) => {
  try {
    const {id} = req.params;
    const history = await historyModel.showHistory(id)
    if(history.length > 0){
        response(res, 'Success', 200, 'Show history success', history[0])
    }else{
        response(res, 'Not found', 200, 'History not found')
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getHistory,
  showHistory,
};
