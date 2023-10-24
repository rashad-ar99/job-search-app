const router = require("express").Router();
const { verifyAccessToken } = require("../../../jwt/jwt_helper");
const { verifyLogin } = require("../../../middlewares/User/auth.middleware");
const Job_controller = require("../../../controllers/User/Job/Job.controller");

router.get("/", verifyAccessToken, verifyLogin, Job_controller.listJobs);
router.get("/:JobUUID", verifyAccessToken, verifyLogin, Job_controller.getJob);

module.exports = router;
