const jwt = require("jsonwebtoken");
const { JWT, ROLES } = require("../lib/const");
const UserRepo = require("../repositories/usersRepo");

const authenticate = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  let token = "";

  if (authHeader && authHeader.startsWith("Bearer"))
    token = authHeader.split(" ")[1];
  else
    return res.status(401).send({
      status_info: false,
      message: "You have to login first",
      data: null,
    });

  try {
    const { username } = jwt.verify(token, JWT.SECRET);

    const getUsers = await UserRepo.getUserByUsername({ username });
    req.users = getUsers;

    next();
  } catch (err) {
    return res.status(401).send({
      status_info: false,
      message: "Please login again",
      data: null,
    });
  }
};

const isSuperAdmin = async (req, res, next) => {
  const user = req.users;

  if (user && user.role === ROLES.isSuperAdmin) {
    return next();
  }
  return res.status(401).json({
    status_info: false,
    message: "You don't have permission (ADMINISTRATOR)",
    data: null,
  });
};

module.exports = { authenticate, isSuperAdmin };
