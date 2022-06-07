const mongoose = require("mongoose");

const liveTrackingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    area: { type: String, },
    coordinates: { type: String, },
    datetime: { type: String, },
    status: { type: String, },

});

module.exports = mongoose.model("LiveTracking", liveTrackingSchema); 