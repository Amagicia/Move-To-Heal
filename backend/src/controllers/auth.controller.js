import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'mock-client-id');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, age, gender });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, picture: user.picture } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    let email, name, picture, googleId;

    if (process.env.GOOGLE_CLIENT_ID) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      googleId = payload.sub;
    } else {
      // Mock data for development
      email = "mockuser@gmail.com";
      name = "Mock User";
      picture = "https://ui-avatars.com/api/?name=Mock+User";
      googleId = "mock123";
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, picture, googleId });
      await user.save();
    }

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken, user: { id: user._id, name: user.name, email: user.email, picture: user.picture } });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed" });
  }
};
