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
    description: String,
    landlord: {
      type: {
        name: String,
        avatar: String,
        rating: Number,
      },
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
