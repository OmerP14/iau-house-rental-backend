const mongoose = require("mongoose");
require("dotenv").config();

const Message = require("./models/Message");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const messages = await Message.find();
    console.log("📨 Tüm mesajlar:", messages);
    process.exit();
  })
  .catch((err) => console.log("❌ Hata:", err));
