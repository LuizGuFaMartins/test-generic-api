const Sequelize = require("sequelize");
const database = require("../resources/database");

const Login = database.define(
  "logins",
  {
    login_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    login_email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    login_password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    login_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    login_photo_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

// Login.hasMany(Student, { foreignKey: "login_id" });

Login.sync();

module.exports = Login;
