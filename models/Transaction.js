const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // <- This is the fix
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    recipient: String,
    status: { type: String, default: "success" },
    completed: { type: Boolean, default: false },
    completed_at: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
