const createError = require("http-errors");
const { Users } = require("../../models");

module.exports = {
	verifyLogin: async (req, res, next) => {
		try {
			if (!req.payload.aud) throw createError.BadRequest("jwt invalid");

			res.locals.User = await Users.findOne({
				where: {
					UUID: req.payload.aud,
					DeletedAt: null,
				},
			});

			if (!res.locals.User) throw createError.Unauthorized("User not found or unavailable");
		} catch (error) {
			next(error);
		}
		next();
	},
};
