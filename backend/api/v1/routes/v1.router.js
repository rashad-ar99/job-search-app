const router = require("express").Router();

const User_router = require("./User/User.router");
router.use("/User", User_router);

module.exports = router;
