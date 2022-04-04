const express = require("express");
const router = express.Router();
const LiveTrackingController = require("../controllers/live_tracking_cont");


router.post("/location_update", LiveTrackingController.update_location);

router.get("/get_loc_list", LiveTrackingController.get_loc_list);

router.post("/get_loc_by_userid", LiveTrackingController.get_loc_by_userid);


module.exports = router;