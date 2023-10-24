const createError = require("http-errors");
const { Jobs, UserJobs } = require("../../../models");

module.exports = {
	listUserJobs: async (req, res, next) => {
		try {
			const allUserJobs = await UserJobs.findAll({
				where: {
					UserUUID: res.locals.User.UUID,
					DeletedAt: null,
				},
				include: [
					{
						model: Jobs,
						required: true,
					},
				],
			});

			res.json({
				status: "success",
				data: {
					UserJobs: allUserJobs,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	applyJob: async (req, res, next) => {
		try {
			if (
				!(await Jobs.findOne({
					where: {
						UUID: req.body.JobUUID,
						DeletedAt: null,
					},
				}))
			)
				throw createError.NotFound("Invalid job");

			if (
				await UserJobs.findOne({
					where: {
						UserUUID: res.locals.User.UUID,
						JobUUID: req.body.JobUUID,
						DeletedAt: null,
					},
				})
			)
				throw createError.Conflict("Application sent already");

			await UserJobs.create({
				UserUUID: res.locals.User.UUID,
				JobUUID: req.body.JobUUID,
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
