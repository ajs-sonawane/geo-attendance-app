const express = require("express");
const router = express.Router();
const MembershipController = require("../controllers/membership_cont");



router.get("/get_membership_schemes", MembershipController.get_all_membership_schemes);

router.post("/add_membership", MembershipController.add_new_membership);

// router.post("/delete_user", MembershipController.user_delete);

module.exports = router;