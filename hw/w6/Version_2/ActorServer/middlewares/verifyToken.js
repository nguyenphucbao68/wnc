import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.username) {
      next();
    }
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }
}

