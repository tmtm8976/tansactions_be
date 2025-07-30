const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createTransaction, getTransactions } = require('../controllers/transactionController');

router.post('/transaction', auth, createTransaction);
router.get('/transactions', auth, getTransactions);

module.exports = router;
