// /routes/User.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const LoginLog = require("../models/LoginLog");

// ✅ Kullanıcı Kayıt (Register)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isLandlord, avatar, rating } = req.body;

    // 1) Aynı e-posta kayıtlı mı?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Bu e-posta zaten kayıtlı." });
    }

    // 2) Şifreyi hash’le
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Yeni kullanıcı objesini oluştur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isLandlord: isLandlord || false,
      avatar: avatar || undefined, // Eğer avatar gönderildiyse kullan, yoksa modelin default’u geçerli
      rating: rating || undefined, // Aynı şekilde rating
    });

    // 4) Kaydet ve döndür
    const savedUser = await newUser.save();
    // Şifreyi geri dönmeyelim:
    const userToReturn = savedUser.toObject();
    delete userToReturn.password;
    res.status(201).json({ message: "Kayıt başarılı", user: userToReturn });
  } catch (err) {
    res.status(500).json({ error: "Kayıt başarısız", details: err.message });
  }
});

// ✅ Kullanıcı Giriş (Login + Log)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Kullanıcı var mı?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    // 2) Şifre doğru mu?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Şifre yanlış" });
    }

    // 3) Giriş log kaydı
    await new LoginLog({
      userId: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    }).save();

    // 4) Dönülecek kullanıcıdan şifre alanını çıkar
    const userToReturn = user.toObject();
    delete userToReturn.password;
    res.status(200).json({ message: "Giriş başarılı", user: userToReturn });
  } catch (err) {
    res.status(500).json({ error: "Giriş başarısız", details: err.message });
  }
});

// 🔍 Tüm Kullanıcıları Listele (Şifre hariç)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Kullanıcılar alınamadı", details: err.message });
  }
});

// ✏️ Kullanıcı Güncelle (admin veya kullanıcı kendisi)
router.put("/update/:id", async (req, res) => {
  try {
    // İsteğe bağlı: burada isLandlord, avatar, rating gibi alanlar da güncellenebilir
    const updateData = { ...req.body };
    if (updateData.password) {
      // Eğer şifre değiştiriliyorsa yeniden hash’leyelim
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");
    if (!updated) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json({ message: "Kullanıcı güncellendi", user: updated });
  } catch (err) {
    res.status(500).json({ error: "Güncelleme hatası", details: err.message });
  }
});

// 🗑️ Kullanıcı Sil (admin)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
    res.json({ message: "Kullanıcı silindi", deleted });
  } catch (err) {
    res.status(500).json({ error: "Silme hatası", details: err.message });
  }
});

module.exports = router;
