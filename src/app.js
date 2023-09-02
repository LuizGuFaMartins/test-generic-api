const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const expressCoreApi = require("./express-core-api");
const indexRouter = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressCoreApi(__dirname + "/models", {
    middlewares: [],
    database: {
      type: "sql",
      connection: {
        credentials: {
          database: process.env.DATABASE_NAME,
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          host: process.env.DATABASE_HOST,
          port: process.env.DATABASE_PORT,
          dialect: process.env.DATABASE_DIALECT,
        },
      },
    },
  })
);

TODO: app.use(cors());

// app.use("/api", indexRouter);

module.exports = app;
