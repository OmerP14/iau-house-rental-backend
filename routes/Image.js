const express = require("express");
const router = express.Router();
const Image = require("../models/Image");

// ✅ Görsel ekle
router.post("/add", async (req, res) => {
  try {
    const { listingId, imageUrl } = req.body;
    const newImage = new Image({ listingId, imageUrl });
    const saved = await newImage.save();
    res.status(201).json({ message: "Görsel eklendi", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Eklenemedi", details: err.message });
  }
});

// ✅ Belirli ilana ait tüm görselleri getir
router.get("/:listingId", async (req, res) => {
  try {
    const images = await Image.find({ listingId: req.params.listingId });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: "Yüklenemedi", details: err.message });
  }
});

// 🗑️ Belirli görseli sil
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Image.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Görsel bulunamadı" });
    res.json({ message: "Görsel silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silinemedi", details: err.message });
  }
});

module.exports = router;
