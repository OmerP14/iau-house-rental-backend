const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    city: String,
    district: String,
    location: String,
    bedrooms: Number,
    bathrooms: Number,
    area: Number, // 👈 Bunu ekliyoruz
    furnished: Boolean,
    petFriendly: Boolean,
    features: [String],
    images: [String],
    landlord: {
      name: String,
      avatar: String,
      rating: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", ListingSchema);
