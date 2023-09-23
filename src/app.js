const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const expressCoreApi = require("./express-core-api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressCoreApi({
    routes: {
      modelsPath: __dirname + "/models",
      generateRoutes: false,
      middlewares: [],
    },
    authentication: {
      provide: false,
      ignoreModels: [],
    },
    models: {
      useDefaultModels: true,
      ignoreModels: [],
    },
  })
);

app.use(cors());

module.exports = app;
