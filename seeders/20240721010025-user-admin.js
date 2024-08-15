"use strict";
const bcrypt = require("bcrypt");
const { JWT } = require("../lib/const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("Udtimur123456", JWT.SALT_ROUND);

    await queryInterface.bulkInsert("users", [
      {
        name: "UdTimur",
        username: "udtimurjaya",
        password: hashedPassword,
        role: "administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
