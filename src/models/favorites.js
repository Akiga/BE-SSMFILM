const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        slug: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Một user chỉ được thích một phim một lần
favoriteSchema.index(
    {
        user: 1,
        slug: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("favorite", favoriteSchema);