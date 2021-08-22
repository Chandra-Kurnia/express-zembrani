import express from 'express';
import typesController from '../controller/types.js';

const router = express.Router();

router.get('/', typesController.gettypes);
export default router;
