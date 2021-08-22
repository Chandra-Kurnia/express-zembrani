import Express from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import vehicle from './src/routes/vehicle.js'
import user from './src/routes/user.js'
import types from './src/routes/types.js'
import { responseError } from './src/helpers/helpers.js';

const app = Express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(Express.json());
app.use(fileUpload());
app.use('/public', Express.static(path.resolve('./public')));
app.use('/file', Express.static(path.resolve('./src/assets/img/')));

app.use('/vehicle', vehicle)
app.use('/user', user)
app.use('/types', types)

app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  return responseError(res, 'Error', 500, err.message, []);
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});