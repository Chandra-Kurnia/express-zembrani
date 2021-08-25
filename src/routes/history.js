import express from 'express';
import historyController from '../controller/history.js';

const router = express.Router();

router
  .get('/getAll', historyController.getHistory)
  .get('/:id', historyController.showHistory)
  .post('/deletehistory', historyController.deleteHistory);
export default router;
