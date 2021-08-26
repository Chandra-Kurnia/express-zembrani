import {response, responseError} from '../helpers/helpers.js';
import historyModel from '../models/history.js';
import rentalModel from '../models/rental.js';

const getHistory = async (req, res, next) => {
  try {
    const user_id = req.userLogin.user_id;
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
    const history = await historyModel.showHistory(id);
    if (history.length > 0) {
      response(res, 'Success', 200, 'Show history success', history[0]);
    } else {
      response(res, 'Not found', 200, 'History not found');
    }
  } catch (err) {
    next(err);
  }
};

const deleteHistory = async (req, res, next) => {
  const {rental_id} = req.body;
  const user_id = req.userLogin.user_id
  const resDataRental = await historyModel.showHistory(rental_id);
  const {quantity, vehicle_id, status} = resDataRental[0];
  let deletedBy = '';
  if (user_id == 1) {
    deletedBy = 'deletedByAdmin';
  } else {
    deletedBy = 'deletedByUser';
  }

  if (status === 'notpaid') {
    historyModel
      .deleteHistory(rental_id, deletedBy)
      .then(() => {
        rentalModel.updateVehicle(quantity, vehicle_id);
        rentalModel.updateRental(rental_id, 'canceled');
        response(res, 'Success', 200, 'succesffully deleted history');
      })
      .catch((err) => {
        responseError(res, 'Error', 500, 'Failed delete history, try again later', err);
      });
  } else if ((status === 'pending') | (status === 'approved')) {
    responseError(res, 'Error', 400, 'This transaction is not finished yet');
  } else if ((status === 'returned') | (status === 'canceled')) {
    historyModel
      .deleteHistory(rental_id, deletedBy)
      .then(() => {
        response(res, 'Success', 200, 'succesffully deleted history');
      })
      .catch((err) => {
        responseError(res, 'Error', 500, 'Failed delete history, try again later', err);
      });
  }
};

export default {
  getHistory,
  showHistory,
  deleteHistory,
};
