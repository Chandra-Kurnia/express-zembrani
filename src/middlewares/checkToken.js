const jwt = require('jsonwebtoken');
const { responseError } = require('../helpers/helpers');

const checkTokenActivation = (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.VERIF_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        responseError(
          res,
          'Token Expired !',
          400,
          'Token is expired, please request activation again to generate a new token',
        );
      } else if (err.name === 'JsonWebTokenError') {
        responseError(
          res,
          'Token Invalid',
          400,
          'Token is invalid, please request activation again to generate a valid token',
        );
      } else {
        responseError(
          res,
          'Token Unactive',
          400,
          'Token is Unactive, please request activation again to generate a active token',
        );
      }
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

const checkTokenForgotPassword = (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.FORGOT_PASSWORD_SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        responseError(
          res,
          'Token Expired !',
          400,
          'Token is expired, please request activation again to generate a new token',
        );
      } else if (err.name === 'JsonWebTokenError') {
        responseError(
          res,
          'Token Invalid',
          400,
          'Token is invalid, please request activation again to generate a valid token',
        );
      } else {
        responseError(
          res,
          'Token Unactive',
          400,
          'Token is Unactive, please request activation again to generate a active token',
        );
      }
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

module.exports = {
  checkTokenActivation,
  checkTokenForgotPassword,
};
