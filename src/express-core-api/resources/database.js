const Sequelize = require("sequelize");

const database_name = process.env.EDUSYSLINK_DATABASE_NAME;
const database_user = process.env.EDUSYSLINK_DATABASE_USER;
const database_password = process.env.EDUSYSLINK_DATABASE_PASSWORD;
const database_host = process.env.EDUSYSLINK_DATABASE_HOST;
const database_port = process.env.EDUSYSLINK_DATABASE_PORT;
const database_dialect = process.env.EDUSYSLINK_DATABASE_DIALECT;
const database_timestamp = process.env.EDUSYSLINK_DATABASE_TIMESTAMP;
const database_underscored = process.env.EDUSYSLINK_DATABASE_UNDERSCORED;
const database_underscored_all = process.env.EDUSYSLINK_DATABASE_UNDERSCORED_ALL;
const database_poll_max = +process.env.EDUSYSLINK_DATABASE_POLL_MAX;
const database_poll_min = +process.env.EDUSYSLINK_DATABASE_POLL_MIN;
const database_poll_acquire = +process.env.EDUSYSLINK_DATABASE_POLL_ACQUIRE;
const database_poll_idle = +process.env.EDUSYSLINK_DATABASE_POLL_IDLE;

const sequelize = new Sequelize(
  database_name,
  database_user,
  database_password,
  {
    host: database_host,
    port: database_port,
    dialect: database_dialect,
    pool: {
      max: database_poll_max || 10,
      min: database_poll_min || 0,
      acquire: database_poll_acquire || 30000,
      idle: database_poll_idle || 10000,
    },
    define: {
      timestamps:
        database_timestamp === "true"
          ? true
          : database_timestamp === "false"
          ? false
          : true,
      underscored:
        database_underscored === "true"
          ? true
          : database_underscored === "false"
          ? false
          : true,
      underscoredAll:
        database_underscored_all === "true"
          ? true
          : database_underscored_all === "false"
          ? false
          : true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log(`Successful connection to ${database_name} database`))
  .catch((error) => console.log(error));

module.exports = sequelize;
