const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const genericRoutes = require("./genericRoutes");
const indexRouter = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  genericRoutes(__dirname + "/models", {
    middlewares: [],
    database: {
      type: "sql",
      connection: {
        credentials: {
          database: "",
          user: "",
          password: "",
          host: "",
          port: "",
          dialect: "",
        },
      },
    },
  })
);

TODO: app.use(cors());

// app.use("/api", indexRouter);

module.exports = app;
