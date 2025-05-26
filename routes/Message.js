const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ✅ Mesaj Gönder
router.post("/send", async (req, res) => {
  try {
    const { fromUserId, toUserId, content } = req.body;
    const newMessage = new Message({ fromUserId, toUserId, content });
    const saved = await newMessage.save();
    res.status(201).json({ message: "Mesaj gönderildi", data: saved });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Mesaj gönderilemedi", details: err.message });
  }
});

// ✅ Kullanıcının Tüm Mesajları
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const messages = await Message.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("fromUserId toUserId");
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Mesajlar yüklenemedi", details: err.message });
  }
});

module.exports = router;
