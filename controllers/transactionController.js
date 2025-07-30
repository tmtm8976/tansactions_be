const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
  const { amount, recipient } = req.body;
  const transaction = new Transaction({
    userId: req.user.id,
    amount,
    recipient
  });
  await transaction.save();
  res.json({ status: 'ok', msg: 'Transaction created' });
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({
    status: 'ok',
    data: transactions.map(t => ({
      created_at: t.createdAt,
      completed_at: t.createdAt,
      updated_at: t.updatedAt,
      completed: t.completed,
      status: t.status,
      amount: t.amount,
      recipient: t.recipient
    }))
  });
};
