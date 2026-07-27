const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    slug: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    poster: {
        type: String,
        required: true,
    },

    episode: {
        type: String,
        default: "",
    },

    currentTime: {
        type: Number,
        default: 0,
    },

    watchedAt: {
        type: Date,
        default: Date.now,
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("History", historySchema);