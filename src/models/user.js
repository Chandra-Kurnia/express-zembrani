import connection from '../configs/db.js';
import {promiseResolveReject} from '../helpers/helpers.js';

const showUser = (email) =>
  new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const register = (form) =>
  new Promise((resolve, reject) => {
    connection.query('INSERT INTO users SET ?', form, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const activation = (user_id) =>
  new Promise((resolve, reject) => {
    connection.query('UPDATE users SET activation = 1 WHERE user_id = ?', user_id, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const changepassword = (newpassword, user_id) =>
  new Promise((resolve, reject) => {
    connection.query('UPDATE users SET password = ? WHERE user_id = ?', [newpassword, user_id], (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

const updateProfile = (data, user_id) =>
  new Promise((resolve, reject) => {
    connection.query(`update users set ? where user_id = ${user_id}`, data, (err, result) => {
      promiseResolveReject(resolve, reject, err, result);
    });
  });

export default {
  showUser,
  register,
  activation,
  changepassword,
  updateProfile,
};
