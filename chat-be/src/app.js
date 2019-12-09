const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
require('./auth/auth');
const routes = require('./routes/routes');
const app = express();

app.use(cors())

mongoose.connect(process.env.DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
mongoose.connection.on('error', error => console.error(error));
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));



app.use('/', routes);

//Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(process.env.PORT, () => {
  console.log('Server started')
});

exports = module.exports = app;