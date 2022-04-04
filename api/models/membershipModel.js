const mongoose = require("mongoose");

const membershipSchema = mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    access_status: { type: String, },
    access_credentials: { type: String, },
    payment: { type: String, },
    validity: { type: String, },
    
});

module.exports = mongoose.model("Membership", membershipSchema);