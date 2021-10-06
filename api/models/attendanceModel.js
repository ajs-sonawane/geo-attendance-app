const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: { type: String, required: true },
    selfie: { type: String, },
    datetime: { type: String, },
    area: { type: String, },
    coordinates: { type: String, },
});

module.exports = mongoose.model("Attendance", attendanceSchema);