const express = require('express');
const historyController = require('../controller/history');
const { Auth } = require('../middlewares/auth');

const router = express.Router();

router
  .get('/getAll', Auth, historyController.getHistory)
  .get('/:id', historyController.showHistory)
  .post('/deletehistory', Auth, historyController.deleteHistory);
module.exports = router;
