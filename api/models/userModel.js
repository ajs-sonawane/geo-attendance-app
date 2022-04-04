const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    company_shift: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyShifts',
        required: true
    },
    name: { type: String, },
    role: { type: String, },
    designation: { type: String, },
    mobile: { type: String, },
    email: { type: String, },
    password: { type: String, },
    user_profile_image: { type: String, },
});

module.exports = mongoose.model("User", userSchema);