const express = require("express");
const router = express.Router();

const signup = require("../../controllers/signup");
const login = require("../../controllers/login");
const current = require("../../controllers/current");
const logout = require("../../controllers/logout");
const { middleware } = require("../../controllers/middleware");
const { avatars, upload } = require("../../controllers/avatars");

router.post("/signup", signup);
router.post("/login", login);
router.get("/current", middleware, current);
router.post("/logout", middleware, logout);
router.patch("/avatars", middleware, upload.single("avatar"), avatars);

module.exports = router;