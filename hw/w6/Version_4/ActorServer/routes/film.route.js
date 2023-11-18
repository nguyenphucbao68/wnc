import express from 'express';
import axios from 'axios';
import verifyToken from '../middlewares/verifyToken.js';
import crypto from 'crypto';

const router = express.Router();

router.get('/', verifyToken, async function (req, res) {
	const url = 'http://localhost:3002/api/films';
	const currentTime = Math.floor(Date.now() / 1000);

	const clientHash = crypto
		.createHash('sha256')
		.update(req.url + currentTime + process.env.SECRET_KEY)
		.digest('hex');

	console.log('clientHash ', clientHash);

	try {
		const response = await axios.get(url, {
			headers: {
				time: currentTime,
				token: clientHash,
			},
		});

		res.json(response.data);
	} catch (error) {
		res.status(401).json({
			error: error.response.data.error,
		});
	}
});

export default router;
