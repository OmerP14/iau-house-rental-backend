const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ROUTES bağlantıları
const listingRoutes = require("./routes/Listing");
const userRoutes = require("./routes/User");
const favoriteRoutes = require("./routes/Favorite");
const messageRoutes = require("./routes/Message");
const reviewRoutes = require("./routes/Review");
const reportRoutes = require("./routes/Report");
const contactRoutes = require("./routes/ContactMessage");
const cityDistrictRoutes = require("./routes/CityDistrict");
const imageRoutes = require("./routes/Image");
const loginLogRoutes = require("./routes/LoginLog");

app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/citydistricts", cityDistrictRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/loginlogs", loginLogRoutes);

app.get("/", (req, res) => {
  res.send("IAU House Rental Backend is working ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
