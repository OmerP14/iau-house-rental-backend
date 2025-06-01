const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
