import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db/index.js';
import fs from 'fs'

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

    const payload = { userId: user.id };
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const profile  = async(req, res) => {
  const { id } = req.params;

  const {userId} = req.body

  console.log("Request: ", userId)

  try {
    const result = await db.query(
      'select name, email from users where id = $1', [id]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'User not found.' });
    }

    const data = {}
    data["user_info"] = result.rows[0]
    data["success"] = true

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Unexpected error occured.' });
  }
}

export const validate = (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = {
      id: decoded.userId,
    };

    return res.json({ valid: true, userInfo: user  });
  } catch (err) {
    console.error('JWT validation failed:', err.message);
    return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
};
