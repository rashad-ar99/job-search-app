const createError = require("http-errors");
const jwt = require("jsonwebtoken");

module.exports = {
	signAccessToken: (ID) => {
		return new Promise((resolve, reject) => {
			const payload = {};
			const secret = process.env.ACCESS_TOKEN_SECRET;
			const options = {
				expiresIn: "10m",
				issuer: process.env.BASE_URL,
				audience: ID,
			};

			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.error(err.message);
					reject(createError.InternalServerError());
				}

				const expiry = new Date(new Date().getTime() + 10 * 60 * 1000).toISOString();

				resolve({ token, expiry });
			});
		});
	},
	verifyAccessToken: (req, res, next) => {
		if (!req.headers["authorization"]) return next(createError.Unauthorized());

		const authHeader = req.headers["authorization"];
		const bearerToken = authHeader.split(" ");
		const token = bearerToken[1];

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			if (err) {
				const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
				return next(createError.Unauthorized(message));
			}
			req.payload = payload;
			next();
		});
	},
	signRefreshToken: (ID) => {
		return new Promise((resolve, reject) => {
			const payload = {};
			const secret = process.env.REFRESH_TOKEN_SECRET;
			const options = {
				expiresIn: "1y",
				issuer: process.env.BASE_URL,
				audience: ID,
			};
			jwt.sign(payload, secret, options, (err, token) => {
				if (err) {
					console.error(err.message);
					reject(createError.InternalServerError());
				}

				const expiry = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
				resolve({ token, expiry });
			});
		});
	},
	verifyRefreshToken: (refreshToken) => {
		return new Promise((resolve, reject) => {
			jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
				if (err) return reject(createError.Unauthorized());

				const UUID = payload.aud;

				resolve(UUID);
			});
		});
	},
};
