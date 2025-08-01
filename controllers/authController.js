const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
  
      const hashed = await bcrypt.hash(password, 10);
      const IDImage = req.file?.filename;
  
      const user = new User({ username, password: hashed, IDImage, device_token });
      await user.save();
  
      // ✅ Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      // ✅ Send token in response
      res.status(201).json({
        status: 'ok',
        msg: 'Registered successfully',
        token,
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  };

exports.login = async (req, res) => {
  try {
    const { username, password, device_token } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    
    if (device_token && user.device_token !== device_token) {
      user.device_token = device_token;
      await user.save(); // Save the updated token
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      status: 'ok',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name ?? 'john'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
