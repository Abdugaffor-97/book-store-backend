const atob = require("atob");
const UserModel = require("../users/schema");

const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    const err = new Error("Auth not provided");
    err.httpStatusCode = 401;
    next(err);
  } else {
    const [email, password] = atob(
      req.headers.authorization.split(" ")[1]
    ).split(":");
    const user = await UserModel.findByCredential(email, password);

    if (!user) {
      const err = new Error("Credentials did not match");
      err.httpStatusCode = 401;
      next(err);
    } else {
      req.user = user;
    }
    next();
  }
};

const adminMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    const err = new Error("Only Admins Can Access");
    next(err);
  }
};

module.exports = {
  basic: basicAuthMiddleware,
  admin: adminMiddleware,
};
