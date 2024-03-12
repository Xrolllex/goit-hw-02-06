const express = require("express");
const router = express.Router();
const { User } = require("../models/schema.js");
const { validateUser } = require("../models/validation");
const { v4: uuidv4 } = require("uuid");
const gravatar = require("gravatar");
const { sendMail } = require("../models/verifyMail");

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

    const avatar = gravatar.url(validate.value.email);
        const user = await new User({
        email: validate.value.email,
        avatarURL: avatar,
        verificationToken: uuidv4(),
      });
 
    await user.setPassword(password);
    await user.save();
    
    await sendMail(user.email, user.verificationToken, false);
    res.json({
      status: "success",
      code: 201,
      data: {
        id: user._id,
        email: user.email,
        verificationToken: user.verificationToken,
      },
      message: "User has been created",
    });

  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Bad Request",
    });
  }
})

module.exports = router;