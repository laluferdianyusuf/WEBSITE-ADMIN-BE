const { users } = require("../models");

class UserRepo {
  static async createUser({ name, username, password, role }) {
    const createUser = await users.create({
      name,
      username,
      password,
      role,
    });

    return createUser;
  }

  static async getUserById({ id }) {
    const getUser = await users.findOne({ where: { id } });
    return getUser;
  }

  static async getUserByUsername({ username }) {
    const getUser = await users.findOne({ where: { username } });
    return getUser;
  }

  static async getUserByEmail({ email }) {
    const getUser = await users.findOne({ where: { email } });
    return getUser;
  }
}

module.exports = UserRepo;
