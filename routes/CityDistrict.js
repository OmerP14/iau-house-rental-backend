const express = require("express");
const router = express.Router();
const CityDistrict = require("../models/CityDistrict");

// ✅ Yeni şehir/ilçe ekle
router.post("/add", async (req, res) => {
  try {
    const { city, district } = req.body;
    const newEntry = new CityDistrict({ city, district });
    const saved = await newEntry.save();
    res.status(201).json({ message: "Eklendi", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Eklenemedi", details: err.message });
  }
});

// ✅ Tüm şehir/ilçe verilerini getir
router.get("/all", async (req, res) => {
  try {
    const data = await CityDistrict.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Veriler alınamadı", details: err.message });
  }
});

// 🗑️ Şehir/ilçe sil
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await CityDistrict.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Bulunamadı" });
    res.json({ message: "Silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silinemedi", details: err.message });
  }
});

// ✏️ Şehir/ilçe güncelle
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await CityDistrict.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updated) return res.status(404).json({ error: "Bulunamadı" });
    res.json({ message: "Güncellendi", updated });
  } catch (err) {
    res.status(500).json({ error: "Güncellenemedi", details: err.message });
  }
});

module.exports = router;
