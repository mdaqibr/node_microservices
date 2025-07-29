const fs = require('fs');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    req.user = {
      id: decoded.sub || decoded.userId,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;