const Sequelize = require("sequelize");
const config = require("../config/database.js").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = sequelize.define("User", {
  balance: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10000,
  },
});

module.exports = { sequelize, User };
