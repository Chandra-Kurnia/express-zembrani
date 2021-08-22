import express from 'express';
import locationController from '../controller/locations.js'

const router = express.Router();

router.get('/', locationController.getlocations);
export default router;
