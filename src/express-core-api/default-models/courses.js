const Sequelize = require("sequelize");
const database = require("../resources/database");

const Course = database.define(
  "courses",
  {
    course_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    course_description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    course_workload: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
);

Course.sync();

module.exports = Course;
