const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users_cont");



router.get("/get_users", UserController.users_get_all);

router.post("/get_employees", UserController.employees_get_all);


router.post("/signin", UserController.user_signin);

router.post("/signup", UserController.user_signup);

router.get("/reset_password", UserController.users_reset_password);


module.exports = router;
