const Express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const vehicle = require('./src/routes/vehicle');
const types = require('./src/routes/types');
const locations = require('./src/routes/locations');
const rental = require('./src/routes/rental');
const { responseError } = require('./src/helpers/helpers');
const history = require('./src/routes/history');
const user = require('./src/routes/user');

const app = Express();
const { PORT } = process.env;

const corsOpt = {
  credentials: true,
  // origin: 'http://localhost:3000',
  origin: ['https://next-zembrani.vercel.app', 'http://localhost:3000'],
};
app.use(cors(corsOpt));
app.use(Express.json());
app.use(fileUpload());
app.use(cookieParser());
app.use('/public', Express.static(path.resolve('./public')));
app.use('/file', Express.static(path.resolve('./src/assets/img/')));

app.use('/vehicle', vehicle);
app.use('/user', user);
app.use('/types', types);
app.use('/locations', locations);
app.use('/history', history);
app.use('/rental', rental);

app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => responseError(res, 'Error', 500, err.message, []));

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
