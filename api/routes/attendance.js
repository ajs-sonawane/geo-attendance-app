const express = require("express");
const router = express.Router();
const AttController = require("../controllers/attendance_cont");


router.get("/get_attendance_by_userid", AttController.att_get_by_userid);

router.post("/save_update_attendance", AttController.att_save_or_update);

// router.post("/signup", UserController.user_signup);

// router.get("/reset_password", UserController.users_reset_password);


module.exports = router;
