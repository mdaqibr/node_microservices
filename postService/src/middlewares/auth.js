import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import jwt from 'jsonwebtoken';

export const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    console.log("process.env.PUBLIC_KEY_PATH", process.env.PUBLIC_KEY_PATH)
    const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
