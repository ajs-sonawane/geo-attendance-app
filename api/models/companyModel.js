const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
    company_name: { type: String, required: true },
    company_mobile: { type: String, },
    company_email: { type: String, },
    comp_regd_location: { type: String, },
    company_image: { type: String, },
    shifts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyShifts',
        required: true
    },
});

module.exports = mongoose.model("Company", companySchema);