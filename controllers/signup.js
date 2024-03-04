const express = require("express");
const router = express.Router();
const { User } = require("../routes/schema");
const { validateUser } = require("../routes/validation");

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { email, password } = body;
  if (!email && !password) {
    return res.json({
      status: "error",
      code: 404,
      message: "Email or password is empty",
    });
  }
  const validate = validateUser(body);
  if (validate.error) {
    return res.json({
      status: "error",
      code: 400,
      message: validate.error.message,
    });
  }
  try {
    const checkUser = await User.findOne({ email }).lean();
    if (checkUser) {
      return res.status(409).json({
        status: "error",
        message: "Email in use",
      });
    }
 
    const user = await new User({ email: validate.value.email });
    await user.setPassword(password);
    await user.save();
    
    res.json({
      status: "success",
      code: 201,
      data: { id: user._id, email: user.email },
      message: "User has been created",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
});

module.exports = router;