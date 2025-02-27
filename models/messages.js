const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
    username: String,
    type: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  });
  module.exports = mongoose.model("Message", messageSchema);