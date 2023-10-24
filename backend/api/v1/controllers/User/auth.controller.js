const createError = require("http-errors");
const crypto = require("crypto");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../../jwt/jwt_helper");
const auth_validation = require("../../validations/User/auth.validation");
const { Users, UserSessions } = require("../../models");

module.exports = {
	register: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.register.validateAsync(req.body);

			if (
				await Users.findOne({
					where: {
						Email: JoiResult.Email,
						DeletedAt: null,
					},
				})
			)
				throw createError.Conflict("Email already exists");

			bcrypt.hash(JoiResult.Password, 10, async (err, hash) => {
				await Users.create({
					Name: JoiResult.Name,
					Email: JoiResult.Email,
					Password: hash,
				});
			});

			res.json({
				status: "success",
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
	login: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.login.validateAsync(req.body);

			const User = await Users.findOne({
				where: {
					Email: JoiResult.Email,
					DeletedAt: null,
				},
			});
			if (!User) throw createError.NotFound("Email not found");
			if (!(await bcrypt.compare(JoiResult.Password, User.Password))) throw createError.Unauthorized("Password incorrect");

			const { token: JWTRefreshToken, expiry: JWTRefreshTokenExpiresAt } = await signRefreshToken(User.UUID);

			const UserSession = await UserSessions.create({
				JWTRefreshToken,
				JWTRefreshTokenExpiresAt,
				UserUUID: User.UUID,
				IP: req.ip,
				UserAgent: req.get("user-agent"),
			});

			const { token: JWTAccessToken, expiry: JWTAccessTokenExpiresAt } = await signAccessToken(User.UUID);

			res.json({
				status: "success",
				data: {
					UserSessionUUID: UserSession.UUID,
					JWTAccessToken,
					JWTAccessTokenExpiresAt,
					JWTRefreshToken,
					JWTRefreshTokenExpiresAt,
					User: {
						UUID: User.UUID,
						Name: User.Name,
						Email: User.Email,
						CreatedAt: User.CreatedAt,
					},
				},
			});
		} catch (error) {
			next(error);
		}
	},
	refreshAccessToken: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.refreshToken.validateAsync(req.body);

			const UserSession = await UserSessions.findOne({ where: { JWTRefreshToken: JoiResult.JWTRefreshToken } });
			if (!UserSession) throw createError.NotFound("Session not found");
			if (UserSession.DeletedAt) throw createError.Forbidden("Session deleted");
			if (UserSession.JWTRefreshTokenExpiresAt < new Date()) throw createError.Forbidden("Session expired");

			const UserID = await verifyRefreshToken(JoiResult.JWTRefreshToken);

			const UserUUID = await verifyRefreshToken(JoiResult.JWTRefreshToken);
			if (UserUUID !== UserSession.UserUUID) throw createError.Forbidden("Token incorrect");

			const { token: JWTAccessToken, expiry: JWTAccessTokenExpiresAt } = await signAccessToken(UserID);

			res.json({
				status: "success",
				data: {
					JWTAccessToken,
					JWTAccessTokenExpiresAt,
					JWTRefreshToken: UserSession.JWTRefreshToken,
					JWTRefreshTokenExpiresAt: UserSession.JWTRefreshTokenExpiresAt,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	logout: async (req, res, next) => {
		try {
			const JoiResult = await auth_validation.refreshToken.validateAsync(req.body);

			const UserSession = await UserSessions.findOne({ where: { JWTRefreshToken: JoiResult.JWTRefreshToken } });
			if (!UserSession) throw createError.NotFound("Session not found");
			if (UserSession.DeletedAt) throw createError.Forbidden("Session already deleted");

			await UserSessions.destroy({
				where: {
					JWTRefreshToken: JoiResult.JWTRefreshToken,
					DeletedAt: null,
				},
			});

			res.json({
				status: "success",
				data: null,
			});
		} catch (error) {
			next(error);
		}
	},
};
