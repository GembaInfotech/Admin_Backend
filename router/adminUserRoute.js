const router = require("express").Router();

const {addAdminUser, signin, logout} = require("../controller/adminUserController");
router.post("/signup",addAdminUser);
router.post("/signin",signin);
router.post("/logout",logout);


module.exports = router;
