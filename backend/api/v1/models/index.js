const Sequelize = require("sequelize");
const config = require("../config/config");
const path = require("path");
const basename = path.basename(__filename);
const fs = require("fs");

const db = {};

const { host, port, username, password, database, dialect } = config[process.env.NODE_ENV || "dev"];

// connect to db
const sequelize = new Sequelize(database, username, password, { dialect });

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established successfully.");
	})
	.catch((error) => {
		console.error("Unable to connect to the database: ", error);
	});

fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
