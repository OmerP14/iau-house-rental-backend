const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    area: Number,
    bedrooms: Number,
    bathrooms: Number,
    city: String,
    district: String,
    location: String,
    furnished: Boolean,
    petFriendly: Boolean,
    features: [String],
    images: [String],
    description: String, // ✅ EKLENDİ
    landlord: {
      name: String,
      avatar: String,
      rating: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
