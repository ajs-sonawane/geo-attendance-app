const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    self_image_file: { type: String, },
    login_datetime: { type: String, },
    logout_datetime: { type: String, },
    login_cords: { type: String, },
    logout_cords: { type: String, },
});

module.exports = mongoose.model("Attendance", attendanceSchema);