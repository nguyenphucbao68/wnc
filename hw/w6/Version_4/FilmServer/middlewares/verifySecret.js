export default function verifySecret(req, res, next) {
  const secret = req.headers['secret'];

  if (!secret) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  if (secret !== process.env.SECRET_KEY) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  next();
}

