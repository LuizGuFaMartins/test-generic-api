const Sequelize = require("sequelize");
const database = require("../resources/database");
const Login = require("./logins");

const Student = database.define(
  "students",
  {
    student_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    student_birthday: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    student_phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    login_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Student.belongsTo(Login, { foreignKey: "login_id", allowNull: false });
// Student.belongsToMany(Subject, {
//   through: StudentSubject,
//   foreignKey: "student_id",
// });

Student.sync();

module.exports = Student;
