const mongoose = require("mongoose");

const companyShiftsSchema = mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    shift_name: { type: String, },
    shift_time: { type: String, },
});

module.exports = mongoose.model("CompanyShifts", companyShiftsSchema);