import {response, responseError} from '../helpers/helpers.js';
import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../helpers/sendEmail.js';

const register = async (req, res, next) => {
  try {
    const {name, email} = req.body;
    const existUser = await userModel.showUser(email);
    if (existUser.length > 0) {
      responseError(res, 'Error', 400, 'Email already registered', {});
    } else {
      const salt = await bcrypt.genSalt(10);
      const form = {
        name,
        email,
        password: await bcrypt.hash(req.body.password, salt),
      };
      userModel
        .register(form)
        .then(async () => {
          const dataUser = await userModel.showUser(email);
          delete dataUser[0].password;
          jwt.sign({...dataUser[0]}, process.env.VERIF_SECRET_KEY, (err, token) => {
            if (err) {
              responseError(res, 'Error', 500, 'Failed create user token');
            } else {
              sendEmail(email, token, name);
              dataUser[0].token = token;
              response(
                res,
                'Success',
                200,
                `Your account successfully created, we send code activation link to ${email}`,
                dataUser[0]
              );
            }
          });
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Failed register, please try again later', err);
        });
    }
  } catch {
    next(err);
  }
};

const activationAccount = async (req, res, next) => {
  try {
    const {user_id} = req.decoded;
    userModel
      .activation(user_id)
      .then(() => {
        response(res, 'Success', 200, 'User activation success');
      })
      .catch((err) => {
        responseError(res, 'Error', 500, 'User Activation failed. Please try again later', err);
      });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  activationAccount,
};
