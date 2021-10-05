const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    role: { type: String, },
    name: { type: String, },
    mobile: { type: String, },
    email: { type: String, },
    password: { type: String, },
});

module.exports = mongoose.model("User", userSchema);