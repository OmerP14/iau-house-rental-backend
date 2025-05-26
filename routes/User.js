const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");

// ✅ Kullanıcı Kayıt (Register)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isLandlord } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Bu e-posta zaten kayıtlı." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isLandlord,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "Kayıt başarılı", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: "Kayıt başarısız", details: err.message });
  }
});

// ✅ Kullanıcı Giriş (Login + Log)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }

    // Giriş log kaydı
    await new LoginLog({
      userId: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    }).save();

    res.status(200).json({ message: "Giriş başarılı", user });
  } catch (err) {
    res.status(500).json({ error: "Giriş başarısız", details: err.message });
  }
});

// 🗑️ Kullanıcı Sil (admin)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.json({ message: "Kullanıcı silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silme hatası", details: err.message });
  }
});

// ✏️ Kullanıcı Güncelle (admin veya kullanıcı)
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    res.json({ message: "Kullanıcı güncellendi", updated });
  } catch (err) {
    res.status(500).json({ error: "Güncelleme hatası", details: err.message });
  }
});

module.exports = router;
