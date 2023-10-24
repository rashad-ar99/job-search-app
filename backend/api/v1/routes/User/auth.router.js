const router = require("express").Router();
const auth_controller = require("../../controllers/User/auth.controller");

router.post("/register", auth_controller.register);
router.post("/login", auth_controller.login);
router.post("/refreshAccessToken", auth_controller.refreshAccessToken);
router.delete("/logout", auth_controller.logout);

module.exports = router;
