const Sequelize = require("sequelize");

const database_name = process.env.DATABASE_NAME;
const database_user = process.env.DATABASE_USER;
const database_password = process.env.DATABASE_PASSWORD;
const database_host = process.env.DATABASE_HOST;
const database_port = process.env.DATABASE_PORT;
const database_dialect = process.env.DATABASE_DIALECT;

const sequelize = new Sequelize(
  database_name,
  database_user,
  database_password,
  {
    host: database_host,
    port: database_port,
    dialect: database_dialect,
  }
);

sequelize
  .authenticate()
  .then(() => console.log(`Successful connection to ${database_name} database`))
  .catch((error) => console.log(error));

module.exports = sequelize;
