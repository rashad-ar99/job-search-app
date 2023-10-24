require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const db = require("./api/v1/models");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const v1_router = require("./api/v1/routes/v1.router");
app.use("/v1", v1_router);

app.use(async (req, res, next) => {
	next(createError.NotFound("Requested API not found"));
});

app.use((error, req, res, next) => {
	console.error(`(\x1b[33m${new Date().toISOString().slice(0, 19).replace("T", " ")}\x1b[0m) \x1b[41mError occurred\x1b[0m${res.writableEnded ? " after res.writableEnded" : ""}`, error);

	if (res.writableEnded) return;

	if (error.isJoi) error.status = 422;
	res.status(error.status || 500).json({
		code: error.status || 500,
		status: error.status >= 400 && error.status < 500 ? "fail" : "error",
		message: error.message || "Unexpected server error",
	});
});

console.log(`Attempting to start server on port ${port}`);

db.sequelize.sync().then(() => {
	app.listen(port, () => {
		console.log(`Server running on port ${port}`);
	});
});
