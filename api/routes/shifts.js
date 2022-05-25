const express = require("express");
const router = express.Router();
const CompShiftsController = require("../controllers/comp_shifts_cont");



router.post("/save_shift", CompShiftsController.add_new_shift);

router.post("/get_shifts_by_compid", CompShiftsController.get_shifts_by_company_id);

router.post("/shift_delete", CompShiftsController.delete_shift);

module.exports = router;