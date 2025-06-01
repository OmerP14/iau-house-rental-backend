const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// ✅ Yorum ekle
router.post("/add", async (req, res) => {
  try {
    const { listingId, userId, rating, comment } = req.body;
    const newReview = new Review({ listingId, userId, rating, comment });
    const saved = await newReview.save();
    res.status(201).json({ message: "Yorum eklendi", review: saved });
  } catch (err) {
    res.status(500).json({ error: "Yorum eklenemedi", details: err.message });
  }
});

// ✅ Belirli ilana ait yorumları getir
router.get("/:listingId", async (req, res) => {
  try {
    const reviews = await Review.find({
      listingId: req.params.listingId,
    }).populate("userId", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Yorumlar alınamadı", details: err.message });
  }
});

// 🗑️ Yorum sil
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Yorum bulunamadı" });
    res.json({ message: "Yorum silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silinemedi", details: err.message });
  }
});

module.exports = router;
