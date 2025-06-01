const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

// ✅ Mesaj gönder
router.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMsg = new ContactMessage({ name, email, message });
    const saved = await newMsg.save();
    res.status(201).json({ message: "Mesaj gönderildi", data: saved });
  } catch (err) {
    res.status(500).json({ error: "Gönderilemedi", details: err.message });
  }
});

// ✅ Tüm mesajları getir (admin panel)
router.get("/all", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Mesajlar alınamadı", details: err.message });
  }
});

module.exports = router;
