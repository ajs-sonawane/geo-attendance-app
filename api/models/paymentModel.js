const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    payment_mode: { type: String, },
    txn_id: { type: String, },
    txn_amount: { type: String, },
    txn_receipt: { type: String, },
    // package: { type: String, },
});

module.exports = mongoose.model("Payment", paymentSchema);