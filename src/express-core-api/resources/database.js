const Sequelize = require("sequelize");

const database_name = process.env.DATABASE_NAME;
const database_user = process.env.DATABASE_USER;
const database_password = process.env.DATABASE_PASSWORD;
const database_host = process.env.DATABASE_HOST;
const database_port = process.env.DATABASE_PORT;
const database_dialect = process.env.DATABASE_DIALECT;
const database_timestamp = process.env.DATABASE_TIMESTAMP;
const database_underscored = process.env.DATABASE_UNDERSCORED;
const database_underscored_all = process.env.DATABASE_UNDERSCORED_ALL;
const database_poll_max = +process.env.DATABASE_POLL_MAX;
const database_poll_min = +process.env.DATABASE_POLL_MIN;
const database_poll_acquire = +process.env.DATABASE_POLL_ACQUIRE;
const database_poll_idle = +process.env.DATABASE_POLL_IDLE;

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
      timestamps: database_timestamp || true,
      underscored: database_underscored || true,
      underscoredAll: database_underscored_all || true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log(`Successful connection to ${database_name} database`))
  .catch((error) => console.log(error));

module.exports = sequelize;
