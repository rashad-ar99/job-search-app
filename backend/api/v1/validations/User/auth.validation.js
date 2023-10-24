const Joi = require("joi");

module.exports = {
	register: Joi.object({
		Name: Joi.string().required(),
		Email: Joi.string().email().lowercase().required(),
		Password: Joi.string().min(8).required(),
	}),
	login: Joi.object({
		Email: Joi.string().email().lowercase().required(),
		Password: Joi.string().allow(null, "").required(),
	}),
	refreshToken: Joi.object({
		JWTRefreshToken: Joi.string().required(),
	}),
};
