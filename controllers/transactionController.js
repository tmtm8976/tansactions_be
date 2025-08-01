const Transaction = require("../models/Transaction");
const admin = require("../firebaseAdmin");
const User = require("../models/User");

exports.createTransaction = async (req, res) => {
  try {
    const { id, recipient, amount } = req.body;
    const userId = req.user.id;

    if (!id || !recipient || !amount ) {
      res
        .status(400)
        .json({ status: "error", msg: "Missing fields" });
    }

    const existing = await Transaction.findOne({_id: id});

    if (existing) {
      // Already processed
      res
        .status(400)
        .json({ status: "error", msg: "Transaction already processed" });
    }

    const transaction = new Transaction({
      _id: id,
      userId,
      amount,
      recipient,
      createdAt: req.body?.createdAt ?? new Date().toISOString(),
      completed: true,
      completed_at: new Date().toISOString(),
    });
    await transaction.save();

    // Get user to retrieve device token
    const user = await User.findById(req.user.id);
    if (user?.device_token) {
      await admin.messaging().send({
        token: user.device_token,
        notification: {
          title: "Transaction Completed",
          body: `Your transaction of $${amount} to ${recipient} was successful.`,
        },
        android: {
          priority: "high",
        },
      });
    }

    res.json({
      status: "ok",
      msg: "Transaction created and notification sent",
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ status: "error", msg: "Transaction failed" });
  }
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json({
    status: "ok",
    data: transactions.map((t) => ({
      created_at: t.createdAt,
      completed_at: t.createdAt,
      updated_at: t.updatedAt,
      completed: t.completed,
      status: t.status,
      amount: t.amount,
      recipient: t.recipient,
    })),
  });
};
