const UserService = require("../services/usersService");

const register = async (req, res) => {
  const { name, username, password, role } = req.body;

  const { status, status_code, message, data } = await UserService.Register({
    name,
    username,
    password,
    role,
  });

  res.status(status_code).send({
    status: status,
    message: message,
    data: data,
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  const { status, status_code, message, data } = await UserService.Login({
    username,
    password,
  });

  res
    .status(status_code)
    .send({ status: status, message: message, data: data });
};

const currentUser = async (req, res) => {
  const currentUser = req.users;

  res.status(200).send({
    status: true,
    message: "You are logged in with this user",
    data: {
      user: currentUser,
    },
  });
};

module.exports = { register, login, currentUser };
