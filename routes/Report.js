const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// ✅ Şikayet gönder
router.post("/add", async (req, res) => {
  try {
    const { reportedBy, targetType, targetId, reason } = req.body;
    const newReport = new Report({ reportedBy, targetType, targetId, reason });
    const saved = await newReport.save();
    res.status(201).json({ message: "Şikayet gönderildi", report: saved });
  } catch (err) {
    res.status(500).json({ error: "Şikayet başarısız", details: err.message });
  }
});

// ✅ Tüm şikayetleri getir
router.get("/all", async (req, res) => {
  try {
    const reports = await Report.find().populate("reportedBy", "name email");
    res.json(reports);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Şikayetler yüklenemedi", details: err.message });
  }
});

// 🗑️ Şikayet sil (sadece admin)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Şikayet bulunamadı" });
    res.json({ message: "Şikayet silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silinemedi", details: err.message });
  }
});

module.exports = router;
