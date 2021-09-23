const express = require('express');
const typesController = require('../controller/types');

const router = express.Router();

router.get('/', typesController.gettypes);
module.exports = router;
