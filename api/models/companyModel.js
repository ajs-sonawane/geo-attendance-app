const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
    active: { type: Number, },
    role: { type: String, },
    company_name: { type: String, },
    company_mobile: { type: String, },
    company_email: { type: String, },
    comp_regd_location: { type: String, },
    company_image: { type: String, },
    company_key: { type: String, },
    company_pwd: { type: String, },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Membership',
        required: true
    }
});

module.exports = mongoose.model("Company", companySchema);