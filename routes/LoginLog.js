const express = require("express");
const router = express.Router();
const LoginLog = require("../models/LoginLog");

// ✅ Tüm giriş kayıtlarını getir (admin için)
router.get("/all", async (req, res) => {
  try {
    const logs = await LoginLog.find()
      .populate("userId", "name email")
      .sort({ loggedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Loglar alınamadı", details: err.message });
  }
});

module.exports = router;
