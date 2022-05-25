const mongoose = require("mongoose");

const membershipSchema = mongoose.Schema({
    membership_name: { type: String, },
    membership_amt: { type: String, },
    validity: { type: String, }
});

module.exports = mongoose.model("Membership", membershipSchema);