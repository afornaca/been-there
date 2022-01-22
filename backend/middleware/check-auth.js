const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') { // browser sends options req on any not GET req to see if server will allow, before sending the actual req
        return next();
    }
  let token;
  try {
    token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed");
    }
      const decodedToken = jwt.verify(token, 'supersecretlol');
      req.userData = {userId: decodedToken.userId};
      next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 401);
    next(error);
  }

};
