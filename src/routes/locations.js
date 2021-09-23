const express = require('express');
const locationController = require('../controller/locations');

const router = express.Router();

router.get('/', locationController.getlocations);
module.exports = router;
