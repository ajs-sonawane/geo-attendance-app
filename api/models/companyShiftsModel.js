const mongoose = require("mongoose");

const companyShiftsSchema = mongoose.Schema({
    shift_name: { type: String, },
    shift_time: { type: String, },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }
});

module.exports = mongoose.model("CompanyShifts", companyShiftsSchema);