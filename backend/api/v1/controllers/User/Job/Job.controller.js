const createError = require("http-errors");
const { Jobs, UserJobs } = require("../../../models");

module.exports = {
	listJobs: async (req, res, next) => {
		try {
			const allJobs = await Jobs.findAll({
				where: {
					DeletedAt: null,
				},
				include: [
					{
						model: UserJobs,
						required: false,
						where: {
							UserUUID: res.locals.User.UUID,
						},
					},
				],
			});

			res.json({
				status: "success",
				data: {
					Jobs: allJobs,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	getJob: async (req, res, next) => {
		try {
			const Job = await Jobs.findOne({
				where: {
					UUID: req.params.JobUUID,
					DeletedAt: null,
				},
				include: [
					{
						model: UserJobs,
						required: false,
						where: {
							UserUUID: res.locals.User.UUID,
						},
					},
				],
			});

			res.json({
				status: "success",
				data: {
					Job,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};
