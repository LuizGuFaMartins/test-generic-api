const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const expressCoreApi = require("./express-core-api");
// const indexRouter = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressCoreApi(__dirname + "/models", {
    middlewares: [],
    ignoreModels: [],
    generateRoutes: true,
    database: {
      type: "sql",
    },
  })
);

app.use(cors());

// app.use("/api", indexRouter);

module.exports = app;
