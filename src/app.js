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
  expressCoreApi(__dirname + "/models", {
    middlewares: [],
    ignoreModels: [],
    generateRoutes: true,
    provideAuthentication: true,
    useDefaultModels: true
  })
);

app.use(cors());

module.exports = app;
