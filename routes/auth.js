const express = require('express');
const router = express.Router();
// const upload = require('../middleware/'); // <-- use custom config
const { register, login } = require('../controllers/authController');
const upload = require('../middlewares/upload');

router.post('/register', upload.single('IDImage'), register);
router.post('/login', login);

module.exports = router;
