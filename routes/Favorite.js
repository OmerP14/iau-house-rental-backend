const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const Listing = require("../models/Listing");

// ✅ Favori Ekle
router.post("/add", async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    // Daha önce eklenmiş mi?
    const already = await Favorite.findOne({ userId, listingId });
    if (already) {
      return res.status(400).json({ error: "Bu ilan zaten favorilerde." });
    }

    const newFavorite = new Favorite({ userId, listingId });
    const saved = await newFavorite.save();
    res.status(201).json({ message: "Favorilere eklendi", favorite: saved });
  } catch (err) {
    res.status(500).json({ error: "Favori eklenemedi", details: err.message });
  }
});

// ❌ Favori Kaldır
router.delete("/remove", async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    const deleted = await Favorite.findOneAndDelete({ userId, listingId });
    if (!deleted) {
      return res.status(404).json({ error: "Favori bulunamadı" });
    }

    res.status(200).json({ message: "Favoriden kaldırıldı" });
  } catch (err) {
    res.status(500).json({ error: "Kaldırılamadı", details: err.message });
  }
});

// 📄 Kullanıcının Favorilerini Listele
router.get("/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: req.params.userId,
    }).populate("listingId");
    res.json(favorites.map((fav) => fav.listingId)); // sadece ilan detayları döner
  } catch (err) {
    res
      .status(500)
      .json({ error: "Favoriler yüklenemedi", details: err.message });
  }
});

module.exports = router;
