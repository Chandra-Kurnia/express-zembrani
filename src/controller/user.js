import {response, responseError} from '../helpers/helpers.js';
import userModel from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../helpers/sendEmail.js';
import sendEmailForgotPw from '../helpers/forgotPassword.js';

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
    responseError(res, 'Error', 500, 'Failed register, please try again later', err);
    // next(err);
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

const forgotPassword = async (req, res, next) => {
  try {
    const {email} = req.body;
    const existUser = await userModel.showUser(email);
    if (existUser.length === 0) {
      responseError(res, 'Error', 400, 'Your email not found', {});
    } else {
      delete existUser[0].password;
      jwt.sign({...existUser[0]}, process.env.FORGOT_PASSWORD_SECRET_KEY, (err, token) => {
        if (err) {
          responseError(res, 'Error', 500, 'Failed create token forgot password');
        } else {
          sendEmailForgotPw(email, token, existUser[0].name);
          existUser[0].token = token;
          response(res, 'Success', 200, 'Successfully create token, check email for reset password', existUser);
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

const checkTokenForgotPassword = (req, res, next) => {
  const {token} = req.params;
  const {decoded} = req;
  delete decoded.password;
  decoded.token = token;
  response(res, 'Success', 200, 'Link reset password success, now you can change your password', decoded);
};

const changePassword = async (req, res, next) => {
  try {
    const {decoded} = req;
    const {password, password2} = req.body;
    if (password === password2) {
      const salt = await bcrypt.genSalt(10);
      const newpassword = await bcrypt.hash(password, salt);
      userModel
        .changepassword(newpassword, decoded.user_id)
        .then(() => {
          response(res, 'Success', 200, 'Your password successfully reset, please login with your new password');
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Failed change password, please try again later', err);
        });
    } else {
      response(res, 'Error', 400, 'Your password and password verify is not match');
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await userModel.showUser(email);
    if (user.length > 0) {
      if (user[0].activation === '0') {
        responseError(res, 'Not verified', 400, 'Your email not verified', {});
      } else {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (!err) {
            if (result) {
              delete user[0].password;
              jwt.sign({...user[0]}, process.env.ACCESS_TOKEN_SECRET_KEY, (err, token) => {
                if (!err) {
                  user[0].token = token;
                  res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 60,
                    secure: true,
                    path: '/',
                    sameSite: 'strict',
                  });
                  // res.cookie('user_id', user[0].user_id, {
                  //   httpOnly: true,
                  //   maxAge: 60 * 60 * 60,
                  //   secure: true,
                  //   path: '/',
                  //   sameSite: 'strict',
                  // });
                  response(res, 'Sucess', 200, 'Login Successfull', user[0]);
                } else {
                  console.log(err);
                  responseError(res, 'Error', 500, 'Failed create access token');
                }
              });
            } else {
              responseError(res, 'Error', 400, 'Your password is wrong');
            }
          } else {
            responseError(res, 'Error', 500, 'Login error, please try again later');
          }
        });
      }
    } else {
      responseError(res, 'User not found', 400, 'Your email not found');
    }
  } catch (error) {
    next(error);
  }
};

const responseDataUser = (req, res, next) => {
  const dataUser = req.userLogin
  // console.log(dataUser);
  response(res, 'Success', 200, 'All data success loaded', dataUser)
}

export default {
  register,
  activationAccount,
  forgotPassword,
  checkTokenForgotPassword,
  changePassword,
  login,
  responseDataUser
};
