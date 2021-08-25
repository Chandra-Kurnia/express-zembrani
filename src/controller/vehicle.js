import {response, responseError, responsePagination} from '../helpers/helpers.js';
import vehicleModel from '../models/vehicle.js';
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import fs from 'fs';

const getVechile = (req, res, next) => {
  const keyword = req.query.keyword || '';
  const type = req.query.type || '';
  const limit = req.query.limit || 2;
  let order = req.query.order || 'DESC';
  let fieldOrder = req.query.fieldOrder || 'vehicle_id';
  let page = req.query.page || 1;
  let nextPage = parseInt(page) + 1;
  let prevPage = page - 1;
  let start = 0;

  if (page > 1) {
    start = (page - 1) * limit;
  }

  vehicleModel
    .getVehicle(type, keyword)
    .then((result) => {
      const count_data = result.length;
      const pages = count_data / limit;
      if (nextPage > pages) {
        nextPage = Math.ceil(pages);
      }
      if (page > pages) {
        page = Math.ceil(pages);
        prevPage = page - 1;
        start = (page - 1) * limit;
      }
      if (count_data > 0) {
        const pagination = {
          count_data,
          pages: Math.ceil(pages),
          limit,
          fieldOrder,
          order,
          currentPage: page,
          nextPage,
          prevPage,
        };
        vehicleModel.getVehicle(type, keyword, order, fieldOrder, start, limit).then((data) => {
          responsePagination(res, 'Success', 200, 'All data successfully loaded', data, pagination);
        });
      } else {
        response(res, 'Not Found', 200, 'Data Not Found');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const showVehicle = (req, res, next) => {
  const id = req.params.id;
  vehicleModel
    .showVehicle(id)
    .then((result) => {
      response(res, 'Success', 200, 'Success show vehicles', result[0]);
    })
    .catch((err) => {
      next(err);
    });
};

const getPopular = (req, res, next) => {
  // console.log(req.headers);
  vehicleModel
    .getPopular()
    .then((result) => {
      response(res, 'Success', 200, '4 data popular successfully loaded', result);
    })
    .catch((err) => {
      next(err);
    });
};

const addVehicle = (req, res, next) => {
  const {location_id, type_id, vehicle_name, price, status, stock, description} = req.body;
  let data = {
    location_id,
    type_id,
    vehicle_name,
    price,
    status,
    stock,
    description,
    remain: stock,
  };
  if (req.files.vehicle_img) {
    const filename = uuidv4() + path.extname(req.files.vehicle_img.name);
    const savePath = path.join(path.dirname(''), '/public/img/vehicles', filename);
    data = {...data, image: `/public/img/vehicles/${filename}`};
    req.files.vehicle_img.mv(savePath);
  }
  vehicleModel
    .addVehicle(data)
    .then(() => {
      response(res, 'Success', 200, 'Successfully added vehicle', data);
    })
    .catch((err) => {
      responseError(res, 'Error', 500, 'Failed added vehicle, please try again later', err);
    });
};

const updateVehicle = (req, res, next) => {
  const {location_id, type_id, vehicle_name, price, status, stock, description} = req.body;
  const id = req.params.id;
  vehicleModel
    .showVehicle(id)
    .then((result) => {
      let data = {
        location_id,
        type_id,
        vehicle_name,
        price,
        status,
        stock,
        description,
        image: result[0].image,
      };

      if (req.files) {
        const filename = uuidv4() + path.extname(req.files.vehicle_img.name);
        const savePath = path.join(path.dirname(''), '/public/img/vehicles', filename);
        data = {...data, image: `/public/img/vehicles/${filename}`};
        req.files.vehicle_img.mv(savePath);
        fs.unlink(`./${result[0].image}`, (err) => {
          if (err) {
            responseError(res, 'Error', 500, 'Error upload image', err);
          }
        });
      }

      vehicleModel
        .updateVehicle(data, id)
        .then(() => {
          response(res, 'Success', 200, 'Succesfully update data vehicle', data);
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Failed update data', err);
        });
    })
    .catch((err) => {
      next(err);
      console.log('failed disini');
    });
};

const deleteVehicle = (req, res, next) => {
  const id = req.params.id;
  vehicleModel
    .showVehicle(id)
    .then((result) => {
      vehicleModel
        .deleteVehicle(id)
        .then(() => {
          fs.unlink(`./${result[0].image}`, (err) => {
            if (err) {
              responseError(res, 'Error', 500, 'Error upload image', err);
            }
          });
          response(res, 'Success', 200, 'Data succesfully deleted');
        })
        .catch((err) => {
          responseError(res, 'Error delete', 500, 'Failed deleted vehicle please try again later');
        });
    })
    .catch((err) => {
      responseError(res, 'Error', 500, 'Failed find data, please try again later', err);
    });
};

const addtohomepage = async (req, res, next) => {
  try {
    const {id} = req.params;
    const getopularvehicle = await vehicleModel.getPopular();
    const mostpopularvehicle = getopularvehicle[0];
    vehicleModel
      .updatecountrental(mostpopularvehicle.count_rental + 1, id)
      .then(() => {
        response(res, 'Success', 200, 'sucessfully add to homepage');
      })
      .catch((err) => {
        responseError(res, 'Error', 500, 'Failed add to homepage, please try again later', err);
      });
  } catch (error) {
    next(error);
  }
};

const removefromhomepage = async (req, res, next) => {
  try {
    const {id} = req.params;
    const getopularvehicle = await vehicleModel.getPopular();
    const mostpopularvehicle = getopularvehicle[3];
    vehicleModel
      .updatecountrental(mostpopularvehicle.count_rental - 1, id)
      .then(() => {
        response(res, 'Success', 200, 'sucessfully remove from homepage');
      })
      .catch((err) => {
        responseError(res, 'Error', 500, 'Failed remove from homepage, please try again later', err);
      });
  } catch (error) {
    next(error);
  }
};

const rental = async (req, res, next) => {
  try {
    const data = req.body;
    const createRental = await vehicleModel.rental(data);
    if (createRental.affectedRows === 1) {
      vehicleModel
        .updateVehicleWhenRented(data.quantity, data.vehicle_id)
        .then(() => {
          response(res, 'Success', 200, 'Rental successfull', data);
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Failed update vehicle when rental please try again later', err);
        });
    } else {
      responseError(res, 'Error', 500, 'Failed create data rental please try again later');
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getVechile,
  addVehicle,
  showVehicle,
  updateVehicle,
  deleteVehicle,
  getPopular,
  addtohomepage,
  removefromhomepage,
  rental,
};
