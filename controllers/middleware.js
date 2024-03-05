const { User } = require("../routes/schema");
const { authToken } = require("../routes/auth");

const middleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.json({
      status: "error",
      code: 401,
      message: "Token is empty",
    });
  }
  
  const user = await authToken(auth);
  
 
  if (!user) {
    return res.json({
      status: "error",
      code: 401,
      message: "User does not exist",
    });
  }
  
  req.user = user;
  next();
};

module.exports = { middleware };
