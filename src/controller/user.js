/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const sendEmailForgotPw = require('../helpers/forgotPassword');
const sendEmail = require('../helpers/sendEmail');
const userModel = require('../models/user');
const { response, responseError } = require('../helpers/helpers');

const register = async (req, res) => {
  try {
    const { name, email } = req.body;
    const existUser = await userModel.showUser(email);
    if (existUser.length > 0) {
      responseError(res, 'Error', 400, 'Email already registered', {});
    } else {
      const salt = await bcrypt.genSalt(10);
      const form = {
        name,
        email,
        password: await bcrypt.hash(req.body.password, salt),
        avatar: '/public/img/avatar/user.png',
      };
      userModel
        .register(form)
        .then(async () => {
          const dataUser = await userModel.showUser(email);
          delete dataUser[0].password;
          jwt.sign({ ...dataUser[0] }, process.env.VERIF_SECRET_KEY, (err, token) => {
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
                dataUser[0],
              );
            }
          });
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Failed register, please try again later', err);
        });
    }
  } catch (error) {
    responseError(res, 'Error', 500, 'Failed register, please try again later', error);
    // next(err);
  }
};

const activationAccount = async (req, res, next) => {
  try {
    const { user_id } = req.decoded;
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
    const { email } = req.body;
    const existUser = await userModel.showUser(email);
    if (existUser.length === 0) {
      responseError(res, 'Error', 400, 'Your email not found', {});
    } else {
      delete existUser[0].password;
      jwt.sign({ ...existUser[0] }, process.env.FORGOT_PASSWORD_SECRET_KEY, (err, token) => {
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

const checkTokenForgotPassword = (req, res) => {
  const { token } = req.params;
  const { decoded } = req;
  delete decoded.password;
  decoded.token = token;
  response(res, 'Success', 200, 'Link reset password success, now you can change your password', decoded);
};

const changePassword = async (req, res, next) => {
  try {
    const { decoded } = req;
    const { password, password2 } = req.body;
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
    const { email, password } = req.body;
    const user = await userModel.showUser(email);
    if (user.length > 0) {
      if (user[0].activation === '0') {
        responseError(res, 'Not verified', 400, 'Your email not verified', []);
      } else {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (!err) {
            if (result) {
              delete user[0].password;
              jwt.sign({ ...user[0] }, process.env.ACCESS_TOKEN_SECRET_KEY, (error, token) => {
                if (!error) {
                  user[0].token = token;
                  res.cookie('token', token, {
                    httpOnly: true,
                    // maxAge: 60 * 60 * 60,
                    secure: true,
                    path: '/',
                    sameSite: 'strict',
                  });
                  response(res, 'Sucess', 200, 'Login Successfull', user[0]);
                } else {
                  console.log(error);
                  responseError(res, 'Error', 500, 'Failed create access token');
                }
              });
            } else {
              responseError(res, 'Error', 400, 'Your password is wrong', []);
            }
          } else {
            responseError(res, 'Error', 500, 'Login error, please try again later', []);
          }
        });
      }
    } else {
      responseError(res, 'User not found', 400, 'Your email not found', []);
    }
  } catch (error) {
    next(error);
  }
};

const responseDataUser = (req, res) => {
  const dataUser = req.userLogin;
  // console.log(dataUser);
  response(res, 'Success', 200, 'All data success loaded', dataUser);
};

const updateProfile = (req, res) => {
  const { email, user_id } = req.userLogin;
  let data = req.body;
  userModel
    .showUser(email)
    .then((result) => {
      data = { ...data, avatar: result[0].avatar };

      if (req.files) {
        const filename = uuidv4() + path.extname(req.files.avatar.name);
        const savePath = path.join(path.dirname(''), '/public/img/avatar', filename);
        data = { ...data, avatar: `/public/img/avatar/${filename}` };
        req.files.avatar.mv(savePath);
        if (result[0].avatar !== '/public/img/avatar/user.png') {
          fs.unlink(`./${result[0].avatar}`, (err) => {
            if (err) {
              responseError(res, 'Error', 500, 'Error upload image', err);
            }
          });
        }
      }

      userModel
        .updateProfile(data, user_id)
        .then(() => {
          response(res, 'Success', 200, 'Succesfully updated data');
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Update failed, try again later', err);
        });
    })
    .catch((err) => {
      responseError(res, 'Error', 500, 'Data failed to load', err);
      console.log(err);
    });
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      // maxAge: 60 * 60 * 60,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });
    response(res, 'Success', 200, 'Logout Success');
  } catch (error) {
    responseError(res, 'Error', 500, 'failed logout', error);
  }
};

module.exports = {
  register,
  activationAccount,
  forgotPassword,
  checkTokenForgotPassword,
  changePassword,
  login,
  responseDataUser,
  updateProfile,
  logout,
};
