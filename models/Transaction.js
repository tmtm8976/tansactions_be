const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  recipient: String,
  status: { type: String, default: 'success' },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
