import express from 'express';
import historyController from '../controller/history.js';
import {Auth, Role} from '../middlewares/auth.js';

const router = express.Router();

router
  .get('/getAll', Auth, historyController.getHistory)
  .get('/:id', historyController.showHistory)
  .post('/deletehistory', Auth,historyController.deleteHistory);
export default router;
