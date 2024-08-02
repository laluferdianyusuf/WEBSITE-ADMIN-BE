const userRepo = require("../repositories/usersRepo");
const bcrypt = require("bcrypt");
const { JWT } = require("../lib/const");
const jwt = require("jsonwebtoken");

class UserService {
  static async Register({ name, username, password }) {
    try {
      if (!name) {
        return {
          status: false,
          status_code: 400,
          message: "name is required",
          data: {
            user: null,
          },
        };
      }
      if (!username) {
        return {
          status: false,
          status_code: 400,
          message: "username is required",
          data: {
            user: null,
          },
        };
      }
      if (!password) {
        return {
          status: false,
          status_code: 400,
          message: "password is required",
          data: {
            user: null,
          },
        };
      } else if (password.length < 8) {
        return {
          status: false,
          status_code: 400,
          message: "password must be at least 8 characters",
          data: {
            user: null,
          },
        };
      }

      const getUser = await userRepo.getUserByUsername({ username });
      if (getUser) {
        return {
          status: false,
          status_code: 400,
          message: "Username already taken",
          data: {
            user: null,
          },
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, JWT.SALT_ROUND);
        const registeredUser = await userRepo.createUser({
          name,
          username,
          password: hashedPassword,
          role: "administrator",
        });
        return {
          status: true,
          status_code: 201,
          message: "Admin successfully registered",
          data: {
            admin: registeredUser,
          },
        };
      }
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: {
          user: null,
        },
      };
    }
  }

  static async Login({ username, password }) {
    try {
      if (!username || !password) {
        return {
          status: false,
          status_code: 400,
          message: "Username and password are required",
          data: { user: null },
        };
      }

      const getUser = await userRepo.getUserByUsername({ username });
      if (!getUser) {
        return {
          status: false,
          status_code: 401,
          message: "Invalid Username, try again",
          data: {
            user: null,
          },
        };
      }

      const isPasswordValid = await bcrypt.compare(password, getUser.password);
      if (!isPasswordValid) {
        return {
          status: false,
          status_code: 401,
          message: "Invalid password, try again",
          data: {
            user: null,
          },
        };
      }

      const token = await jwt.sign(
        {
          id: getUser.id,
          name: getUser.name,
          username: getUser.username,
        },
        JWT.SECRET
      );

      return {
        status: true,
        status_code: 200,
        message: "Your account is registered",
        data: {
          user: token,
        },
      };
    } catch (error) {
      return {
        status: false,
        status_code: 500,
        message: error.message,
        data: {
          user: null,
        },
      };
    }
  }
}

module.exports = UserService;
