const mongoose = require("mongoose");

const cityDistrictSchema = new mongoose.Schema({
  city: String,
  district: String,
});

module.exports = mongoose.model("CityDistrict", cityDistrictSchema);
