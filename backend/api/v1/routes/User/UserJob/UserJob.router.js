const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/User/auth.middleware");
const UserJob_controller = require("../../../controllers/User/UserJob/UserJob.controller");

router.get("/", verifyAccessToken, verifyLogin, UserJob_controller.listUserJobs);
router.post("/", verifyAccessToken, verifyLogin, UserJob_controller.applyJob);

module.exports = router;
