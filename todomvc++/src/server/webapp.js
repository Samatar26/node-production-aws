'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const xShenanigansMiddleware = require('./middlewares/xShenanigans')
const routes = require('./controllers/routes');

let app = express();

// Configure view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by')

// Configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
// Configure logging middleware
app.use(morgan('combined'))
// Static file serving happens everywhere but in production
if (process.env.NODE_ENV !== 'production') {
  let staticPath = path.join(__dirname, '..', '..', 'public');
  app.use('/static', express.static(staticPath));
}

// add X-Shenanigans header to todo route
app.use('/todos', xShenanigansMiddleware())
// Mount application routes
routes(app);

// Export Express webapp instance
module.exports = app;
