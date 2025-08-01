const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register controller
exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword, device_token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const IDImage = req.file?.filename;

    if (!device_token) {
      console.warn(`Register Warning: device_token not provided for user "${username}"`);
    }

    const user = new User({
      username,
      password: hashedPassword,
      IDImage,
      device_token: device_token || null,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      status: 'ok',
      msg: 'Registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        device_token: user.device_token,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { username, password, device_token } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (device_token && user.device_token !== device_token) {
      user.device_token = device_token;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      status: 'ok',
      token,
      user: {
        id: user._id,
        username: user.username,
        device_token: user.device_token,
        name: user.name ?? user.username,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
