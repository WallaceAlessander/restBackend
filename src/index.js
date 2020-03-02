const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require('morgan');


// Initializations
const app = express();
require('./database');

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Routes
app.use(require('./rutas/index.js'))


// Starting the app
app.listen(app.get("port"), () => {
  console.log("GuestBook App started on port", app.get("port"));
});
