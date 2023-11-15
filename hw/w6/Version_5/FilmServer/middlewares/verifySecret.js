import crypto from 'crypto';

export default function verifySecret(req, res, next) {
  const clientTime = req.headers['time'];
  const clientHash = req.headers['token'];

  if (!clientTime || !clientHash) {
    return res.status(401).json({
      error: 'Unauthorized',
    });
  }

  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime - parseInt(clientTime, 10) > 60) {
    return res.status(401).json({
      error: 'Request time expired',
    });
  }

  const serverHash = crypto
    .createHash('sha256')
    .update(req.url + clientTime + process.env.SECRET_KEY)
    .digest('hex');

  if (serverHash !== clientHash) {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }

  next();
}
