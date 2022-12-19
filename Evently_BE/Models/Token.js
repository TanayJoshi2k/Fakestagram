const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 3600 },
});

const Tokens = mongoose.model("Tokens", TokenSchema);

module.exports = Tokens;
