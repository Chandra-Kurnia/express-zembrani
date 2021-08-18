const convertImgVehicle = (req, res, next) => {
  if (req.files) {
    if (req.files.vehicle_img) {
      delete req.files.vehicle_img.data;
      req.body.vehicle_img = {...req.files.vehicle_img};
    }
  }
  next();
};

export default {
    convertImgVehicle
}