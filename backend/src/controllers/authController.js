const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, phone });
  if (user) {
    res.status(201).json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user._id) });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (user && (await user.matchPassword(password))) {
    res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { registerUser, loginUser, getMe };