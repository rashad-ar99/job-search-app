const router = require("express").Router();
const { verifyAccessToken } = require("../../jwt/jwt_helper");
const { verifyLogin } = require("../../middlewares/User/auth.middleware");
const User_controller = require("../../controllers/User/User.controller.js");

router.get("/", verifyAccessToken, verifyLogin, User_controller.getUser);

const auth_router = require("./auth.router");
router.use("/auth", auth_router);

const Job_router = require("./Job/Job.router");
router.use("/Job", Job_router);

const UserJob_router = require("./UserJob/UserJob.router");
router.use("/UserJob", UserJob_router);

module.exports = router;
