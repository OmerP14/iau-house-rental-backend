const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

console.log("📦 routes/Listing.js dosyası yüklendi");

// ✅ Yeni ilan ekle
router.post("/add", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Tüm ilanları getir
router.get("/", async (req, res) => {
  try {
    const all = await Listing.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Belirli ilanı sil
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "İlan bulunamadı" });
    res.json({ message: "İlan silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silme hatası", details: err.message });
  }
});

// ✏️ Belirli ilanı güncelle
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // güncel hali dönsün
    );
    if (!updated) return res.status(404).json({ error: "İlan bulunamadı" });
    res.json({ message: "İlan güncellendi", updated });
  } catch (err) {
    res.status(500).json({ error: "Güncelleme hatası", details: err.message });
  }
});

module.exports = router;
