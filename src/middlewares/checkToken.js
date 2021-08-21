import {responseError} from '../helpers/helpers.js';
import jwt from 'jsonwebtoken';

const checkTokenActivation = async (req, res, next) => {
  const {token} = req.params;
  jwt.verify(token, process.env.VERIF_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        responseError(
          res,
          'Token Expired !',
          400,
          'Token is expired, please request activation again to generate a new token'
        );
      } else if (err.name === 'JsonWebTokenError') {
        responseError(
          res,
          'Token Invalid',
          400,
          'Token is invalid, please request activation again to generate a valid token'
        );
      } else {
        responseError(
          res,
          'Token Unactive',
          400,
          'Token is Unactive, please request activation again to generate a active token'
        );
      }
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

export default {
  checkTokenActivation,
};
